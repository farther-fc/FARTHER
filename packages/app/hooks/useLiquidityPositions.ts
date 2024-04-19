import { useWriteContract } from "wagmi";
import { NFTPositionMngrAbi, UniswapV3StakerAbi } from "@farther/common";
import { contractAddresses, incentivePrograms } from "@farther/common";
import { useUser } from "@lib/context/UserContext";
import { Address } from "viem";
import React from "react";
import { readContract } from "viem/actions";
import { viemClient } from "@lib/walletConfig";
import { useLogError } from "hooks/useLogError";
import { getIncentiveKey } from "@lib/utils";
import { useToast } from "hooks/useToast";
import {
  Position as RawPosition,
  Reward,
  Token,
  Account,
  Pool,
  getBuiltGraphSDK,
} from "../.graphclient";
import { useQuery } from "@tanstack/react-query";

type Position = Pick<RawPosition, "id" | "tokenId" | "isStaked"> & {
  account: Pick<Account, "id"> & {
    rewards: Array<
      Pick<Reward, "amount"> & {
        token: Pick<Token, "id">;
      }
    >;
  };
  pool: Pick<Pool, "id">;
  reward: bigint;
};

const sdk = getBuiltGraphSDK();

export function useLiquidityPositions() {
  const { account } = useUser();
  const [positions, setPositions] = React.useState<Position[]>();
  const logError = useLogError();
  const { toast } = useToast();
  const {
    writeContractAsync: transferToStakerContract,
    error: stakeError,
    failureReason: stakeFailureReason,
    isPending: stakePending,
    isSuccess: stakeSuccess,
  } = useWriteContract();

  const {
    writeContractAsync: unstake,
    error: unstakeError,
    failureReason: unstakeFailureReason,
    isPending: unstakePending,
    isSuccess: unstakeSuccess,
  } = useWriteContract();

  const {
    writeContractAsync: claimReward,
    error: claimError,
    failureReason: claimFailureReason,
    isPending: claimPending,
    isSuccess: claimSuccess,
  } = useWriteContract();

  const {
    data: positionsData,
    error: positionsFetchError,
    isLoading: positionsLoading,
    refetch: refetchPositions,
  } = useQuery({
    queryKey: [account.address],
    queryFn: () =>
      sdk.FartherPositions({
        account: account.address as Address,
        poolId: contractAddresses.UNIV3_FARTHER_ETH_30BPS_POOL,
      }),
    enabled: !!account.address,
  });

  const handleStake = async (tokenId: string) => {
    if (!account.address) {
      logError({ error: "No account address found", showGenericToast: true });
      return;
    }

    try {
      await transferToStakerContract({
        abi: NFTPositionMngrAbi,
        address: contractAddresses.NFT_POSITION_MANAGER,
        functionName: "safeTransferFrom",
        args: [
          account.address,
          contractAddresses.UNISWAP_V3_STAKER,
          BigInt(tokenId),
          getIncentiveKey({
            rewardToken: incentivePrograms[1].rewardToken,
            pool: incentivePrograms[1].pool,
            startTime: incentivePrograms[1].startTime,
            endTime: incentivePrograms[1].endTime,
            refundee: incentivePrograms[1].refundee,
            hashed: false,
          }),
        ],
      });

      await refetchPositions();
    } catch (error) {
      logError({ error });
    }
  };

  const handleUnstake = async (tokenId: string) => {
    if (!account.address) {
      logError({ error: "No account address found", showGenericToast: true });
      return;
    }

    try {
      await unstake({
        abi: UniswapV3StakerAbi,
        address: contractAddresses.UNISWAP_V3_STAKER,
        functionName: "unstakeToken",
        args: [
          {
            rewardToken: incentivePrograms[1].rewardToken,
            pool: incentivePrograms[1].pool,
            startTime: BigInt(incentivePrograms[1].startTime),
            endTime: BigInt(incentivePrograms[1].endTime),
            refundee: incentivePrograms[1].refundee,
          },
          BigInt(tokenId),
        ],
      });

      await refetchPositions();
    } catch (error) {
      logError({ error });
    }
  };

  const handleClaim = async (amount: bigint) => {
    if (!account.address) {
      logError({ error: "No account address found", showGenericToast: true });
      return;
    }

    try {
      await claimReward({
        abi: UniswapV3StakerAbi,
        address: contractAddresses.UNISWAP_V3_STAKER,
        functionName: "claimReward",
        args: [contractAddresses.FARTHER, account.address, amount],
      });

      await refetchPositions();
    } catch (error) {
      logError({ error });
    }
  };

  React.useEffect(() => {
    if (!stakeError && !stakeFailureReason) return;
    logError({
      error: stakeError || stakeFailureReason,
      showGenericToast: true,
    });
  }, [logError, stakeError, stakeFailureReason]);

  React.useEffect(() => {
    if (!stakeSuccess) return;

    toast({ msg: "Staking complete. Enjoy your rewards!" });
  }, [toast, stakeSuccess]);

  React.useEffect(() => {
    if (!positionsData?.positions.length || !account.address) return;

    const positions: Position[] = [];

    (async () => {
      for (const position of positionsData.positions) {
        const reward = await readContract(viemClient, {
          abi: UniswapV3StakerAbi,
          address: contractAddresses.UNISWAP_V3_STAKER,
          functionName: "rewards",
          args: [contractAddresses.FARTHER, account.address as Address],
        });

        positions.push({ ...position, reward });
      }
      setPositions(positions);
    })();
  }, [positionsData, account.address]);

  /** Wipe positions when account is changed */
  React.useEffect(() => {
    if (!account.address) return;
    setPositions(undefined);
  }, [account.address]);

  return {
    positionsLoading,
    positions,
    handleClaim,
    handleStake,
    handleUnstake,
    claimPending,
    stakePending,
    unstakePending,
    stakeSuccess,
    unstakeSuccess,
  };
}
