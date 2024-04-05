import { useReadContract, useWriteContract } from "wagmi";
import { NFTPositionMngrAbi, UniswapV3Staker } from "@common/abis";
import { contractAddresses, uniswapIncentivePrograms } from "@common/constants";
import { defaultChainId } from "@common/env";
import { useUser } from "@lib/context/UserContext";
import { Address, getAddress } from "viem";
import React from "react";
import { readContract } from "viem/actions";
import { viemClient, viemPublicClient } from "@lib/walletConfig";
import { useLogError } from "hooks/useLogError";
import { Position } from "@lib/types/contractTypes";
import { getIncentiveKey } from "@lib/utils";
import { sepolia } from "viem/chains";
import { useToast } from "hooks/useToast";
import { FartherAirdrop__factory } from "@common/typechain";

export function useLiquidityPositions() {
  const { account } = useUser();
  const logError = useLogError();
  const { toast } = useToast();
  const [loadingPositions, setLoadingPositions] = React.useState(false);
  const [positions, setPositions] = React.useState<Record<string, Position>>();
  const {
    writeContractAsync: transferToStakerContract,
    error: stakeError,
    failureReason: stakeFailureReason,
    isPending: stakePending,
    isSuccess: stakeSuccess,
  } = useWriteContract();

  const { refetch: balanceOf } = useReadContract({
    abi: NFTPositionMngrAbi,
    address: contractAddresses[defaultChainId].NFT_POSITION_MANAGER,
    functionName: "balanceOf",
    args: [account.address as Address],
    query: {
      enabled: !!account.address,
    },
  });

  React.useEffect(() => {
    (async () => {
      if (!account.address) return;
      console.log("fetching logs");
      const latestBlock = await viemPublicClient.getBlockNumber();

      const logs = await viemPublicClient.getContractEvents({
        address: contractAddresses[defaultChainId].NFT_POSITION_MANAGER,
        abi: NFTPositionMngrAbi,
        eventName: "Transfer",
        args: {
          from: getAddress(account.address),
          to: getAddress(contractAddresses[defaultChainId].UNISWAP_V3_STAKER),
        },
        // fromBlock: latestBlock - BigInt(10000),
      });

      console.log({ logs });
    })();
  }, [account.address]);

  /**
   * Fetches & filters LP tokens the user currently holds (hasn't staked)
   */
  React.useEffect(() => {
    if (!account.address) return;

    setLoadingPositions(true);
    balanceOf().then(async ({ data: balance }) => {
      if (!balance) {
        setLoadingPositions(false);
        return;
      }

      if (typeof balance !== "bigint" && typeof balance !== "number") {
        throw new Error("Invalid balance type");
      }

      try {
        for (let i = 0; i < balance; i++) {
          const tokenId = await readContract(viemClient, {
            abi: NFTPositionMngrAbi,
            address: contractAddresses[defaultChainId].NFT_POSITION_MANAGER,
            functionName: "tokenOfOwnerByIndex",
            args: [account.address as Address, BigInt(i)],
          });

          if (!tokenId) {
            throw new Error(
              `Failed to read NonfungiblePositionManager.tokenOfOwnerByIndex for ${account.address} at index ${i}`,
            );
          }

          const positionInfo = await readContract(viemClient, {
            abi: NFTPositionMngrAbi,
            address: contractAddresses[defaultChainId].NFT_POSITION_MANAGER,
            functionName: "positions",
            args: [tokenId],
          });

          const [
            nonce,
            operator,
            token0,
            token1,
            fee,
            tickLower,
            tickUpper,
            liquidity,
            feeGrowthInside0LastX128,
            feeGrowthInside1LastX128,
            tokensOwed0,
            tokensOwed1,
          ] = positionInfo;

          // Filter out positions that are not for the 0.03% fee tier FARTHER-ETH (WETH) pool
          if (
            token0.toLowerCase() !==
              contractAddresses[defaultChainId].FARTHER ||
            token1.toLowerCase() !== contractAddresses[defaultChainId].WETH ||
            fee !== 3000
          ) {
            continue;
          }

          setPositions((prev) => ({
            ...prev,
            [tokenId.toString()]: {
              nonce,
              operator,
              token0,
              token1,
              fee,
              tickLower,
              tickUpper,
              liquidity,
              feeGrowthInside0LastX128,
              feeGrowthInside1LastX128,
              tokensOwed0,
              tokensOwed1,
            },
          }));
        }
      } catch (error: any) {
        logError({ error: error.message });
      }

      setLoadingPositions(false);
    });
  }, [account.address, balanceOf, logError]);

  const handleStakeLpToken = async (tokenId: string) => {
    if (!account.address) {
      logError({ error: "No account address found", showGenericToast: true });
      return;
    }

    try {
      await transferToStakerContract({
        abi: NFTPositionMngrAbi,
        address: contractAddresses[defaultChainId].NFT_POSITION_MANAGER,
        functionName: "safeTransferFrom",
        args: [
          account.address,
          contractAddresses[defaultChainId].UNISWAP_V3_STAKER,
          BigInt(tokenId),
          getIncentiveKey({
            rewardToken:
              uniswapIncentivePrograms[defaultChainId][1].rewardToken,
            pool: uniswapIncentivePrograms[defaultChainId][1].pool,
            startTime: uniswapIncentivePrograms[defaultChainId][1].startTime,
            endTime: uniswapIncentivePrograms[defaultChainId][1].endTime,
            refundee: uniswapIncentivePrograms[defaultChainId][1].refundee,
            hashed: false,
          }),
        ],
      });
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

  return {
    loadingPositions,
    positions,
    handleStakeLpToken,
    stakePending,
    stakeSuccess,
  };
}
