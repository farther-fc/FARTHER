import {
  UniswapV3StakerAbi,
  contractAddresses,
  incentivePrograms,
} from "@farther/common";
import { ROUTES } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { createContainer } from "@lib/context/unstated";
import { viemClient } from "@lib/walletConfig";
import { useQuery } from "@tanstack/react-query";
import { useLogError } from "hooks/useLogError";
import { usePathname } from "next/navigation";
import React from "react";
import { Address } from "viem";
import { readContract } from "viem/actions";
import { useReadContract } from "wagmi";
import { FartherPositionsQuery, getBuiltGraphSDK } from "../../.graphclient";

export type Position = FartherPositionsQuery["positions"][number] & {
  unclaimedRewards: bigint;
};

const POSITIONS_REFRESH_INTERVAL = 3000;

const sdk = getBuiltGraphSDK();

const LiquidityContext = createContainer(function () {
  const { account } = useUser();
  const [positions, setPositions] = React.useState<Position[]>();
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

  const positionsLoading =
    _positionsLoading ||
    (!!positionsData?.positions.length && !positions?.length);

  const refetchUnclaimedRewards = React.useCallback(async () => {
    if (!positionsData?.positions.length || !account.address) return;

    const positions: Position[] = [];

    for (const position of positionsData.positions) {
      let unclaimedRewards = BigInt(0);

      try {
        [unclaimedRewards] = await readContract(viemClient, {
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
            BigInt(position.id),
          ],
        });
        // The above will throw an error if the position is not staked
      } catch (error) {}

      positions.push({ ...position, unclaimedRewards });
    }
    setPositions(positions);
  }, [positionsData?.positions, account.address]);

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

  /** Wipe positions when account is changed */
  React.useEffect(() => {
    if (!account.address) return;
    setPositions(undefined);
  }, [account.address]);

  React.useEffect(() => {
    if (
      !positionsData?.positions.length ||
      (pathname !== ROUTES.liquidty.path && pathname !== ROUTES.rewards.path)
    )
      return;

    timer.current = setInterval(() => {
      refetchPositions();
      refetchUnclaimedRewards();
    }, POSITIONS_REFRESH_INTERVAL);

    return () => clearInterval(timer.current);
  }, [
    positionsData?.positions.length,
    refetchPositions,
    refetchUnclaimedRewards,
    pathname,
  ]);

  React.useEffect(() => {
    if (!account.address) {
      setPositions(undefined);
    }
  }, [account]);

  return {
    positionsLoading,
    positions,
    claimableRewards: claimableRewards || BigInt(0),
    refetchPositions,
    refetchClaimableRewards,
    claimableRewardsLoading,
  };
});

export const LiquidityProvider = LiquidityContext.Provider;
export const useLiquidity = LiquidityContext.useContainer;
