import { CHAIN_ID, clientConfig } from "@farther/common";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { createClient, createPublicClient } from "viem";
import { anvil, base, sepolia } from "wagmi/chains";

export const WALLET_CONNECT_PROJECT_ID = "4861dc911064227b7cf8377990e49577";

export const wagmiConfig = getDefaultConfig({
  appName: "Farther",
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [base, sepolia, anvil],
  ssr: true,
});

export const viemClient = createClient(clientConfig[CHAIN_ID]);
export const viemPublicClient = createPublicClient(clientConfig[CHAIN_ID]);
