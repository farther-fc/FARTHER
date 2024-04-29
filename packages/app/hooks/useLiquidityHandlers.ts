import { useWriteContract } from "wagmi";
import { NFTPositionMngrAbi, UniswapV3StakerAbi } from "@farther/common";
import { contractAddresses, incentivePrograms } from "@farther/common";
import { useUser } from "@lib/context/UserContext";
import { Address } from "viem";
import React from "react";
import { useLogError } from "hooks/useLogError";
import { getIncentiveKey } from "@lib/utils";
import { useToast } from "hooks/useToast";
import { FartherPositionsQuery } from "../.graphclient";
import { useLiquidity } from "@lib/context/LiquidityContext";

export type Position = FartherPositionsQuery["positions"][number] & {
  unclaimedRewards: bigint;
};

export function useLiquidityHandlers() {
  const { account, refetchBalance } = useUser();
  const logError = useLogError();
  const { toast } = useToast();
  const { refetchPositions, refetchClaimedRewards } = useLiquidity();

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

      await withdraw({
        abi: UniswapV3StakerAbi,
        address: contractAddresses.UNISWAP_V3_STAKER,
        functionName: "withdrawToken",
        args: [BigInt(tokenId), account.address as Address, "0x"],
      });

      toast({
        msg: "Your position is now unstaked and the rewards are in your wallet. Enjoy!",
      });

      await refetchPositions();
      await refetchBalance();
      refetchClaimedRewards();
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
      !withdrawFailureReason
    )
      return;

    const error =
      stakeError ||
      stakeFailureReason ||
      unstakeError ||
      unstakeFailureReason ||
      withdrawError ||
      withdrawFailureReason;
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
  ]);

  return {
    handleStake,
    handleUnstake,
    handleWithdraw,
    txPending: stakePending || unstakePending || withdrawPending,
    stakeSuccess,
    unstakeSuccess,
    withdrawSuccess,
  };
}
