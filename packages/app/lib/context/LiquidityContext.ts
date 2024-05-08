import {
  NFTPositionMngrAbi,
  UniswapV3StakerAbi,
  contractAddresses,
  incentivePrograms,
  viemClient,
  viemPublicClient,
} from "@farther/common";
import { ROUTES } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { createContainer } from "@lib/context/unstated";
import { useQuery } from "@tanstack/react-query";
import { useLogError } from "hooks/useLogError";
import { usePathname } from "next/navigation";
import pMap from "p-map";
import React from "react";
import { Address } from "viem";
import { readContract } from "viem/actions";
import { useReadContract } from "wagmi";
import { FartherPositionsQuery, getBuiltGraphSDK } from "../../.graphclient";

export type Position = FartherPositionsQuery["positions"][number] & {
  unclaimedRewards: bigint;
  liquidity: bigint;
};

const sdk = getBuiltGraphSDK();

const LiquidityContext = createContainer(function () {
  const { account } = useUser();
  const [positions, setPositions] = React.useState<Position[]>();
  const logError = useLogError();
  const pathname = usePathname();

  const {
    data: claimableRewards,
    error: claimableRewardsFetchError,
    isLoading: claimableRewardsLoading,
    refetch: refetchClaimableRewards,
  } = useReadContract({
    abi: UniswapV3StakerAbi,
    address: contractAddresses.UNISWAP_V3_STAKER,
    functionName: "rewards",
    args: [contractAddresses.FARTHER, account.address as Address],
    query: {
      enabled: !!account.address,
    },
  });

  const {
    data: indexerData,
    error: positionsFetchError,
    isLoading: _positionsLoading,
    refetch: refetchIndexerData,
  } = useQuery({
    queryKey: [account.address],
    queryFn: () => {
      if (!account.address) return null;
      return sdk.FartherPositions({
        ownerId: account.address.toLowerCase() as Address,
        poolId: contractAddresses.UNIV3_FARTHER_ETH_30BPS_POOL,
      });
    },
    enabled: !!account.address,
  });

  const indexerDataLoading =
    _positionsLoading ||
    (!!indexerData?.positions.length && !positions?.length);

  const fetchPositionLiqAndRewards = React.useCallback(async () => {
    if (!indexerData?.positions.length || !account.address) return;
    try {
      const unclaimedRewards = await pMap(
        indexerData.positions,
        async (p: (typeof indexerData.positions)[0]) => {
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
            return unclaimedReward;
          } catch (e: any) {
            if (e.message?.includes("stake does not exist")) {
              return BigInt(0);
            } else {
              throw e;
            }
          }
        },
        { concurrency: 3 },
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
          unclaimedRewards: unclaimedRewards[i],
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
  }, [indexerData, account.address, logError]);

  React.useEffect(() => {
    if (!positionsFetchError) return;

    logError({
      error: positionsFetchError,
      toastMsg:
        "Failed to fetch liquidity positions. This may be due to a temporary network error.",
    });
  }, [logError, positionsFetchError]);

  React.useEffect(() => {
    if (!claimableRewardsFetchError) return;

    logError({
      error: claimableRewardsFetchError,
      toastMsg:
        "Failed to fetch claimable rewards. This may be due to a temporary network error.",
    });
  }, [logError, claimableRewardsFetchError]);

  React.useEffect(() => {
    if (
      !indexerData?.positions.length ||
      (pathname !== ROUTES.liquidty.path && pathname !== ROUTES.rewards.path)
    )
      return;

    fetchPositionLiqAndRewards();
  }, [indexerData?.positions.length, fetchPositionLiqAndRewards, pathname]);

  /** Wipe positions when account is changed */
  React.useEffect(() => {
    if (!account.address) return;
    setPositions(undefined);
  }, [account.address]);

  return {
    rewardsClaimed:
      (indexerData?.accountById?.rewardsClaimed as string | undefined) ||
      BigInt(0),
    indexerDataLoading,
    positions,
    claimableRewards: claimableRewards || BigInt(0),
    refetchIndexerData,
    refetchClaimableRewards,
    claimableRewardsLoading,
  };
});

export const LiquidityProvider = LiquidityContext.Provider;
export const useLiquidity = LiquidityContext.useContainer;
