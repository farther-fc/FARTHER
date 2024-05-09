import {
  NFTPositionMngrAbi,
  UniswapV3StakerAbi,
  contractAddresses,
  incentivePrograms,
} from "@farther/common";
import { useLiquidity } from "@lib/context/LiquidityContext";
import { useUser } from "@lib/context/UserContext";
import { useLogError } from "hooks/useLogError";
import { useToast } from "hooks/useToast";
import React from "react";
import { ContractFunctionExecutionError, encodeFunctionData } from "viem";
import { useWriteContract } from "wagmi";
import { FartherPositionsQuery } from "../.graphclient";

const WAIT_TIME_UNTIL_REFETCH = 5000;

export type Position = FartherPositionsQuery["positions"][number] & {
  unclaimedRewards: bigint;
};

export function useLiquidityHandlers() {
  const { account, refetchBalance } = useUser();
  const logError = useLogError();
  const { toast } = useToast();
  const { refetchIndexerData, refetchClaimableRewards } = useLiquidity();

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
          incentivePrograms[1].incentiveKey,
        ],
      });
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
    } catch (error) {
      if (error instanceof ContractFunctionExecutionError) {
        // We should be able to safely ignore this. Seems to happen intermittently when the function returns "0x" as expected
      }
      logError({ error });
    }
  };

  React.useEffect(() => {
    if (!stakeSuccess) return;
    toast({
      msg: (
        <>
          Your position is now staked. You will accrue rewards while the price
          of Farther remains in your position's liquidity range.{" "}
          <p>Note: It may take a minute for the values to update.</p>
        </>
      ),
    });

    setTimeout(() => {
      refetchIndexerData();
    }, WAIT_TIME_UNTIL_REFETCH);
  }, [stakeSuccess, refetchIndexerData, toast]);

  React.useEffect(() => {
    if (!unstakeSuccess) return;
    toast({
      msg: (
        <div>
          Your position is now unstaked and your rewards can be claimed. Click
          'Claim' to transfer them to your wallet.{" "}
          <p>Note: It may take a minute for the values to update.</p>
        </div>
      ),
    });
    setTimeout(() => {
      refetchClaimableRewards();
      refetchIndexerData();
    }, WAIT_TIME_UNTIL_REFETCH);
  }, [unstakeSuccess, toast, refetchClaimableRewards, refetchIndexerData]);

  React.useEffect(() => {
    if (!claimSuccess) return;
    toast({
      msg: (
        <div>
          Your rewards have been claimed and transferred to your wallet.{" "}
          <p>Note: It may take a minute for the values to update.</p>
        </div>
      ),
    });

    setTimeout(() => {
      refetchClaimableRewards();
      refetchBalance();
      refetchIndexerData();
    }, WAIT_TIME_UNTIL_REFETCH);
  }, [
    claimSuccess,
    toast,
    refetchClaimableRewards,
    refetchBalance,
    refetchIndexerData,
  ]);

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
