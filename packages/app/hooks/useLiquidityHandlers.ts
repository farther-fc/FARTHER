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
import { ContractFunctionExecutionError, encodeFunctionData } from "viem";
import { useWriteContract } from "wagmi";
import { FartherPositionsQuery } from "../.graphclient";

export type Position = FartherPositionsQuery["positions"][number] & {
  unclaimedRewards: bigint;
};

export function useLiquidityHandlers() {
  const { account, refetchBalance } = useUser();
  const logError = useLogError();
  const { toast } = useToast();
  const { refetchPositions, refetchClaimableRewards } = useLiquidity();

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

    try {
      await unstake({
        abi: UniswapV3StakerAbi,
        address: contractAddresses.UNISWAP_V3_STAKER,
        functionName: "multicall",
        args: [
          [
            encodeFunctionData({
              abi: UniswapV3StakerAbi,
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
            }),
            encodeFunctionData({
              abi: UniswapV3StakerAbi,
              functionName: "withdrawToken",
              args: [BigInt(tokenId), account.address, "0x"],
            }),
          ],
        ],
      });

      setTimeout(() => {
        refetchClaimableRewards();
      }, 3000);
    } catch (error) {
      if (error instanceof ContractFunctionExecutionError) {
        // We should be able to safely ignore this. Seems to happen intermittently when the function returns "0x" as expected
      }
      logError({ error });
    }
  };

  const handleClaimRewards = async () => {
    if (!account.address) {
      logError({ error: "No account address found", showGenericToast: true });
      return;
    }

    try {
      await claim({
        abi: UniswapV3StakerAbi,
        address: contractAddresses.UNISWAP_V3_STAKER,
        functionName: "claimReward",
        args: [contractAddresses.FARTHER, account.address, BigInt(0)],
      });

      setTimeout(() => {
        refetchClaimableRewards();
        refetchBalance();
      }, 3000);
    } catch (error) {
      if (error instanceof ContractFunctionExecutionError) {
        // We should be able to safely ignore this. Seems to happen intermittently when the function returns "0x" as expected
      }
      logError({ error });
    }
  };

  React.useEffect(() => {
    if (!unstakeSuccess) return;
    toast({
      msg: "Your position is now unstaked and your rewards can be claimed. Click 'Claim' to transfer them to your wallet.",
    });
  }, [unstakeSuccess, toast]);

  React.useEffect(() => {
    if (!claimSuccess) return;
    toast({
      msg: "Your rewards have been claimed and transferred to your wallet.",
    });
  }, [claimSuccess, toast]);

  React.useEffect(() => {
    if (
      !stakeError &&
      !stakeFailureReason &&
      !unstakeError &&
      !unstakeFailureReason &&
      !claimError &&
      !claimFailureReason
    )
      return;

    const error =
      stakeError ||
      stakeFailureReason ||
      unstakeError ||
      unstakeFailureReason ||
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
    claimError,
    claimFailureReason,
  ]);

  return {
    handleStake,
    handleUnstake,
    handleClaimRewards,
    stakePending,
    unstakePending,
    claimPending,
    stakeSuccess,
    unstakeSuccess,
    claimSuccess,
  };
}
