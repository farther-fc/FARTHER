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

const POSITIONS_REFRESH_INTERVAL = 5_000;

const sdk = getBuiltGraphSDK();

const LiquidityContext = createContainer(function () {
  const { account } = useUser();
  const positionsRef = React.useRef<Position[]>();
  const [positionsCount, setPositionsCount] = React.useState(0);
  const logError = useLogError();
  const timer = React.useRef<NodeJS.Timeout>();
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
    data: positionsData,
    error: positionsFetchError,
    isLoading: _positionsLoading,
    refetch: refetchPositions,
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

  console.log({
    _positionsLoading,
    positionsDataLength: positionsData?.positions.length,
    "positionsRef.current": positionsRef.current,
  });

  const positionsLoading =
    _positionsLoading ||
    (!!positionsData?.positions.length && !positionsRef.current?.length);

  const fetchPositionLiqAndRewards = React.useCallback(async () => {
    if (!positionsData?.positions.length || !account.address) return;
    try {
      const unclaimedRewards = await pMap(
        positionsData.positions,
        async (p: (typeof positionsData.positions)[0]) => {
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
        positionsData.positions,
        async (p: (typeof positionsData.positions)[0]) => {
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

      const sortedPositions = positionsData.positions
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

      positionsRef.current = sortedPositions;
      setPositionsCount(sortedPositions.length);
    } catch (error) {
      logError({
        error,
      });
    }
  }, [positionsData, account.address, logError]);

  const updatePositionRewards = React.useCallback(async () => {
    if (!positionsRef.current?.length || !account.address) return;

    const stakedPositions = positionsRef.current.filter((p) => p.isStaked);
    const unstakedPositions = positionsRef.current.filter((p) => !p.isStaked);

    if (!stakedPositions.length) {
      clearInterval(timer.current);
      return;
    }

    try {
      const unclaimedRewards = await pMap(
        stakedPositions,
        async (p: (typeof positionsRef.current)[0]) => {
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

      const newPositionsData = [
        ...stakedPositions.map((p, i) => ({
          ...p,
          unclaimedRewards: unclaimedRewards[i],
        })),
        ...unstakedPositions,
      ];
      positionsRef.current = newPositionsData;
      setPositionsCount(newPositionsData.length);
    } catch (error) {
      logError({
        error,
      });
    }
  }, [account.address, logError]);

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
      timer.current ||
      !positionsData?.positions.length ||
      (pathname !== ROUTES.liquidty.path && pathname !== ROUTES.rewards.path)
    )
      return;

    refetchPositions();
    fetchPositionLiqAndRewards();

    timer.current = setInterval(() => {
      updatePositionRewards();
    }, POSITIONS_REFRESH_INTERVAL);

    return () => clearInterval(timer.current);
  }, [
    positionsData?.positions.length,
    refetchPositions,
    updatePositionRewards,
    fetchPositionLiqAndRewards,
    pathname,
  ]);

  /** Wipe positions when account is changed */
  React.useEffect(() => {
    if (!account.address) return;
    positionsRef.current = undefined;
    setPositionsCount(0);
  }, [account.address]);

  return {
    positionsLoading,
    positions: positionsRef.current,
    claimableRewards: claimableRewards || BigInt(0),
    refetchPositions,
    refetchClaimableRewards,
    claimableRewardsLoading,
  };
});

export const LiquidityProvider = LiquidityContext.Provider;
export const useLiquidity = LiquidityContext.useContainer;
