import {
  DEV_DEPLOYER_ADDRESS,
  ERC20__factory,
  NEXT_PUBLIC_BASE_RPC_URL,
  UNISWAP_REWARDS_PROGRAM_1_AMOUNT,
  UniswapV3StakerAbi,
  WAD_SCALER,
  contractAddresses,
} from "@farther/common";
import { Address, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

if (!process.env.DEPLOYER_PK) {
  throw new Error("DEPLOYER_PK not found");
}

/**
 * NOTE: I had to do this on etherscan (because I don't want to get in the habit of transferring tokens to the deployer pk)
 * Keeping this script as a way of printing out values in the future if needed.
 */

const SIX_MONTHS_IN_SECONDS = BigInt(30 * 6 * 24 * 60 * 60);
const START_TIME = BigInt(Math.floor(new Date(1715835354000).getTime() / 1000));
const END_TIME = START_TIME + SIX_MONTHS_IN_SECONDS;
const AMOUNT = BigInt(UNISWAP_REWARDS_PROGRAM_1_AMOUNT) * WAD_SCALER;

const account = privateKeyToAccount(process.env.DEPLOYER_PK as `0x${string}`);

const wallet = createWalletClient({
  chain: base as any,
  transport: http(NEXT_PUBLIC_BASE_RPC_URL),
  account,
});

async function createIncentive() {
  // Approve staker to transfer tokens
  const approveHash = await wallet.writeContract({
    DEV_DEPLOYER_ADDRESS,
    address: contractAddresses.FARTHER,
    abi: ERC20__factory.abi,
    functionName: "approve",
    args: [contractAddresses.UNISWAP_V3_STAKER, AMOUNT * BigInt(1000)],
    chain: base as any,
    account,
  });

  console.info({ approveHash });

  // Wait 15 seconds
  console.info("Waiting 5 seconds...");
  await new Promise((resolve) => setTimeout(resolve, 5_000));

  const createIncentiveHash = await wallet.writeContract({
    DEV_DEPLOYER_ADDRESS,
    address: contractAddresses.UNISWAP_V3_STAKER,
    abi: UniswapV3StakerAbi,
    functionName: "createIncentive",
    args: [
      {
        rewardToken: contractAddresses.FARTHER as Address,
        pool: contractAddresses.UNIV3_FARTHER_ETH_30BPS_POOL as Address,
        startTime: START_TIME,
        endTime: END_TIME,
        refundee: DEV_DEPLOYER_ADDRESS,
      },
      AMOUNT,
    ],
    chain: base as any,
    account,
  });

  console.info({ createIncentiveHash });
}

createIncentive().catch(console.error);
