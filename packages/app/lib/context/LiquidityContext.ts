import { FartherPositionsQuery, getBuiltGraphSDK } from ".graphclient";
import { AllocationType } from "@farther/backend";
import {
  LIQUIDITY_BONUS_MAX,
  LIQUIDITY_BONUS_MULTIPLIER,
  NFTPositionMngrAbi,
  UniswapV3StakerAbi,
  WAD_SCALER,
  contractAddresses,
  getStartOfMonthUTC,
  incentivePrograms,
  minBigInt,
  viemClient,
  viemPublicClient,
} from "@farther/common";
import { POSITIONS_REFRESH_INTERVAL, ROUTES } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { createContainer } from "@lib/context/unstated";
import { getEarliestStart } from "@lib/getEarliestStart";
import { formatAirdropTime } from "@lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useLogError } from "hooks/useLogError";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import pMap from "p-map";
import React from "react";
import { Address } from "viem";
import { readContract } from "viem/actions";
import { useReadContract } from "wagmi";

export type Position = FartherPositionsQuery["positions"][number] & {
  pendingStakedLiqRewards: bigint;
  liquidity: bigint;
};

const sdk = getBuiltGraphSDK();

const PATHS: string[] = [ROUTES.liquidty.path, ROUTES.profile.path];

const LiquidityContext = createContainer(function () {
  const router = useRouter();
  const isValidPath = PATHS.includes(router.pathname);
  const pollingTimer = React.useRef<NodeJS.Timeout>();
  const { accountAddress, user } = useUser();
  const [positions, setPositions] = React.useState<Position[]>();
  const logError = useLogError();
  const pathname = usePathname();
  const {
    data: claimableOnchainRewards,
    error: claimableOnchainRewardsFetchError,
    isLoading: claimableOnchainRewardsLoading,
    refetch: refetchClaimableOnchainRewards,
  } = useReadContract({
    abi: UniswapV3StakerAbi,
    address: contractAddresses.UNISWAP_V3_STAKER,
    functionName: "rewards",
    args: [contractAddresses.FARTHER, accountAddress as Address],
    query: {
      enabled: isValidPath && !!accountAddress,
    },
  });
  const {
    data: indexerData,
    error: positionsFetchError,
    isLoading: _positionsLoading,
    refetch: refetchIndexerData,
  } = useQuery({
    queryKey: [accountAddress],
    queryFn: () => {
      if (!accountAddress) return null;
      return sdk.FartherPositions({
        ownerId: accountAddress.toLowerCase() as Address,
        poolId: contractAddresses.UNIV3_FARTHER_ETH_30BPS_POOL,
      });
    },
    enabled: isValidPath && !!accountAddress,
  });

  const indexerDataLoading =
    _positionsLoading ||
    (!!indexerData?.positions.length && !positions?.length);

  const getPendingRewards = React.useCallback(
    async (positions: FartherPositionsQuery["positions"]) => {
      const pendingRewards = {} as Record<string, bigint>;
      await pMap(
        positions,
        async (p: (typeof positions)[0]) => {
          try {
            const [unclaimedReward] = await readContract(viemClient, {
              abi: UniswapV3StakerAbi,
              address: contractAddresses.UNISWAP_V3_STAKER,
              functionName: "getRewardInfo",
              args: [
                {
                  rewardToken: contractAddresses.FARTHER,
                  pool: contractAddresses.UNIV3_FARTHER_ETH_30BPS_POOL,
                  startTime: BigInt(incentivePrograms[1].startTime),
                  endTime: BigInt(incentivePrograms[1].endTime),
                  refundee: incentivePrograms[1].refundee,
                },
                // tokenId
                BigInt(p.id),
              ],
            });
            pendingRewards[p.id] = unclaimedReward;
          } catch (e: any) {
            if (e.message?.includes("stake does not exist")) {
              pendingRewards[p.id] = BigInt(0);
            } else {
              throw e;
            }
          }
        },
        { concurrency: 3 },
      );

      return pendingRewards;
    },
    [],
  );

  const fetchPositionLiqAndRewards = React.useCallback(async () => {
    if (!indexerData?.positions.length || !accountAddress) return;
    try {
      const pendingStakedLiqRewards = await getPendingRewards(
        indexerData.positions.filter((p) => p.isStaked),
      );

      const liquidity = await pMap(
        indexerData.positions,
        async (p: (typeof indexerData.positions)[0]) => {
          const info = await viemPublicClient.readContract({
            abi: NFTPositionMngrAbi,
            address: contractAddresses.NFT_POSITION_MANAGER,
            functionName: "positions",
            args: [
              // tokenId
              BigInt(p.id),
            ],
          });
          return info[7];
        },
        { concurrency: 3 },
      );

      const sortedPositions = indexerData.positions
        .map((p, i) => ({
          ...p,
          pendingStakedLiqRewards: pendingStakedLiqRewards[p.id] || BigInt(0),
          liquidity: liquidity[i],
        }))
        .sort((a, b) => {
          if (a.liquidity < b.liquidity) {
            return 1;
          } else if (a.liquidity > b.liquidity) {
            return -1;
          } else {
            return 0;
          }
        });

      setPositions(sortedPositions);
    } catch (error) {
      logError({
        error,
      });
    }
  }, [indexerData, accountAddress, logError, getPendingRewards]);

  // Poll for pending rewards
  React.useEffect(() => {
    if (!positions?.some((p) => p.isStaked)) return;

    pollingTimer.current = setTimeout(async () => {
      const pendingRewards = await getPendingRewards(
        positions.filter((p) => p.isStaked),
      );

      const updatedPositions = positions.map((p) => ({
        ...p,
        pendingStakedLiqRewards: pendingRewards[p.id] || BigInt(0),
      }));

      setPositions(updatedPositions);

      return () => clearTimeout(pollingTimer.current);
    }, POSITIONS_REFRESH_INTERVAL);
  }, [positions, getPendingRewards]);

  // Clear polling if connected address changes
  React.useEffect(() => {
    if (!accountAddress) return;
    clearTimeout(pollingTimer.current);
  }, [accountAddress]);

  React.useEffect(() => {
    if (!positionsFetchError) return;

    logError({
      error: positionsFetchError,
      toastMsg:
        "Failed to fetch liquidity positions. This may be due to a temporary network error.",
    });
  }, [logError, positionsFetchError]);

  React.useEffect(() => {
    if (!claimableOnchainRewardsFetchError) return;

    logError({
      error: claimableOnchainRewardsFetchError,
      toastMsg:
        "Failed to fetch claimable rewards. This may be due to a temporary network error.",
    });
  }, [logError, claimableOnchainRewardsFetchError]);

  React.useEffect(() => {
    if (
      !indexerData?.positions.length ||
      (pathname !== ROUTES.liquidty.path && pathname !== ROUTES.profile.path)
    )
      return;

    fetchPositionLiqAndRewards();
  }, [indexerData?.positions.length, fetchPositionLiqAndRewards, pathname]);

  /** Wipe positions when account is changed */
  React.useEffect(() => {
    if (!accountAddress) return;
    setPositions(undefined);
  }, [accountAddress]);

  const rewardsClaimed = indexerData?.accountById?.rewardsClaimed as
    | string
    | undefined;

  const pendingStakedLiqRewards =
    positions?.reduce(
      (total, p) => total + BigInt(p.pendingStakedLiqRewards),
      BigInt(0),
    ) || BigInt(0);

  const liquidityBonusAllocations =
    user?.allocations.filter((a) => a.type === AllocationType.LIQUIDITY) || [];

  const airdroppedBonusAllocations =
    liquidityBonusAllocations.filter((a) => !!a.airdrop) || [];

  const unclaimedBonusAllocations =
    airdroppedBonusAllocations.filter((a) => !a.isClaimed) || [];

  // This is the total amount of liqudity rewards that have received an airdropped bonus
  const airdroppedReferenceTotal = airdroppedBonusAllocations.reduce(
    (acc, curr) => BigInt(curr.referenceAmount || "0") + acc,
    BigInt(0),
  );

  // console.log({
  //   claimableOnchainRewards,
  //   rewardsClaimed,
  //   pendingStakedLiqRewards,
  //   airdroppedReferenceTotal,
  //   airdroppedBonusAllocations,
  // });

  // Pending reference amount is anything left over after subtracting the airdropped reference
  // (onchain amount that has an associated airdropped bonus) from the total onchain rewards claimed.
  // Multiply by multiplier to get the bonus.
  const uncappedBonus =
    ((claimableOnchainRewards || BigInt(0)) +
      BigInt(rewardsClaimed || "0") +
      pendingStakedLiqRewards -
      airdroppedReferenceTotal) *
    BigInt(LIQUIDITY_BONUS_MULTIPLIER);

  const pendingBonusAmount = minBigInt(
    uncappedBonus,
    BigInt(LIQUIDITY_BONUS_MAX) * WAD_SCALER,
  );

  const unclaimedBonusStartTime = getEarliestStart(unclaimedBonusAllocations);

  const hasCurrentCycleBeenAirdropped = unclaimedBonusStartTime
    ? unclaimedBonusStartTime > Date.now()
    : false;

  const bonusLpRewardsDropDate = formatAirdropTime(
    getStartOfMonthUTC(hasCurrentCycleBeenAirdropped ? 2 : 1),
  );

  return {
    rewardsClaimed,
    indexerDataLoading,
    positions,
    claimableRewards: claimableOnchainRewards || BigInt(0),
    refetchIndexerData,
    refetchClaimableRewards: refetchClaimableOnchainRewards,
    claimableRewardsLoading: claimableOnchainRewardsLoading,
    pendingBonusAmount,
    unclaimedBonusAllocations,
    unclaimedBonusStartTime,
    bonusLpRewardsDropDate,
  };
});

export const LiquidityProvider = LiquidityContext.Provider;
export const useLiquidity = LiquidityContext.useContainer;
