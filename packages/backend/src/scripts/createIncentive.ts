import {
  DEV_DEPLOYER_ADDRESS,
  ERC20__factory,
  UniswapV3StakerAbi,
  WAD_SCALER,
  contractAddresses,
} from "@farther/common";
import { Address, createWalletClient, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

if (!process.env.BASE_RPC_URL) {
  throw new Error("BASE_RPC_URL not found");
}
if (!process.env.DEPLOYER_PK) {
  throw new Error("DEPLOYER_PK not found");
}

const SIX_MONTHS_IN_SECONDS = BigInt(30 * 6 * 24 * 60 * 60);
const START_TIME = BigInt(Math.floor(Date.now() / 1000 + 60)); // 1 minute from now
const END_TIME = START_TIME + SIX_MONTHS_IN_SECONDS;
const AMOUNT = BigInt(2_500_000_000) * WAD_SCALER;

const account = privateKeyToAccount(process.env.DEPLOYER_PK as `0x${string}`);

const wallet = createWalletClient({
  chain: base as any,
  transport: http(process.env.BASE_RPC_URL),
  account,
});

async function createIncentive() {
  // Approve staker to transfer tokens
  const approveHash = await wallet.writeContract({
    DEV_DEPLOYER_ADDRESS,
    address: contractAddresses.FARTHER,
    abi: ERC20__factory.abi,
    functionName: "approve",
    args: [contractAddresses.UNISWAP_V3_STAKER, AMOUNT],
    chain: base as any,
    account,
  });

  console.log({ approveHash });

  // Wait 15 seconds
  console.log("Waiting 15 seconds...");
  await new Promise((resolve) => setTimeout(resolve, 15_000));

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

  console.log({ createIncentiveHash });
}

createIncentive().catch(console.error);
