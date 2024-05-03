import {
  NFTPositionMngrAbi,
  UniswapV3StakerAbi,
  contractAddresses,
  incentivePrograms,
} from "@farther/common";
import { useLiquidity } from "@lib/context/LiquidityContext";
import { useUser } from "@lib/context/UserContext";
import { getIncentiveKey } from "@lib/utils";
import { useLogError } from "hooks/useLogError";
import { useToast } from "hooks/useToast";
import React from "react";
import { useWriteContract } from "wagmi";
import { FartherPositionsQuery } from "../.graphclient";

export type Position = FartherPositionsQuery["positions"][number] & {
  unclaimedRewards: bigint;
};

export function useLiquidityHandlers() {
  const { account, refetchBalance } = useUser();
  const logError = useLogError();
  const { toast } = useToast();
  const { refetchPositions, refetchAccruedRewards, accruedRewards } =
    useLiquidity();

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
    writeContractAsync: withdraw,
    error: withdrawError,
    failureReason: withdrawFailureReason,
    isPending: withdrawPending,
    isSuccess: withdrawSuccess,
    ...rest
  } = useWriteContract();

  const {
    writeContractAsync: claim,
    error: claimError,
    failureReason: claimFailureReason,
    isPending: claimPending,
    isSuccess: claimSuccess,
  } = useWriteContract();

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

      toast({
        msg: "Your position is now staked. You will accrue rewards while the price of Farther remains in your position's liquidity range.",
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

    toast({
      msg: "This is a two-step process. You will first approve a transaction to unstake your position. Then, an additional transaction is required to withdraw your liquidity token to your wallet.",
    });

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

      toast({
        msg: "Your position is now unstaked. Click withdraw to transfer it back to your wallet.",
      });

      await refetchPositions();
      await refetchAccruedRewards();
    } catch (error) {
      logError({ error });
    }
  };

  const handleWithdraw = async (tokenId: string) => {
    if (!account.address) {
      logError({ error: "No account address found", showGenericToast: true });
      return;
    }

    try {
      await withdraw({
        abi: UniswapV3StakerAbi,
        address: contractAddresses.UNISWAP_V3_STAKER,
        functionName: "withdrawToken",
        args: [BigInt(tokenId), account.address, "0x"],
      });

      toast({
        msg: "Your LP token has been withdrawn.",
      });

      await refetchPositions();
      await refetchBalance();
    } catch (error) {
      logError({ error });
    }
  };

  React.useEffect(() => {
    if (
      !stakeError &&
      !stakeFailureReason &&
      !unstakeError &&
      !unstakeFailureReason &&
      !withdrawError &&
      !withdrawFailureReason &&
      !claimError &&
      !claimFailureReason
    )
      return;

    const error =
      stakeError ||
      stakeFailureReason ||
      unstakeError ||
      unstakeFailureReason ||
      withdrawError ||
      withdrawFailureReason ||
      claimError ||
      claimFailureReason;
    logError({
      error,
      showGenericToast: true,
    });
  }, [
    logError,
    stakeError,
    stakeFailureReason,
    unstakeError,
    unstakeFailureReason,
    withdrawError,
    withdrawFailureReason,
    claimError,
    claimFailureReason,
  ]);

  const handleClaimRewards = async () => {
    if (!account.address) {
      logError({ error: "No account address found", showGenericToast: true });
      return;
    }

    console.log(accruedRewards);

    try {
      await claim({
        abi: UniswapV3StakerAbi,
        address: contractAddresses.UNISWAP_V3_STAKER,
        functionName: "claimReward",
        args: [contractAddresses.FARTHER, account.address, BigInt(0)],
      });

      toast({
        msg: "Rewards claimed!",
      });

      await refetchAccruedRewards();
    } catch (error) {
      logError({ error });
    }
  };

  return {
    handleStake,
    handleUnstake,
    handleWithdraw,
    handleClaimRewards,
    stakePending,
    unstakePending,
    withdrawPending,
    claimPending,
    stakeSuccess,
    unstakeSuccess,
    withdrawSuccess,
    claimSuccess,
  };
}
