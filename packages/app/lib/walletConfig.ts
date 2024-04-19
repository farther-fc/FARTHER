import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, base, anvil } from "wagmi/chains";
import {
  createClient,
  createPublicClient,
  http,
  PublicClientConfig,
} from "viem";
import { CHAIN_ID } from "@farther/common";

export const WALLET_CONNECT_PROJECT_ID = "4861dc911064227b7cf8377990e49577";

export const wagmiConfig = getDefaultConfig({
  appName: "Farther",
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [sepolia, base, anvil],
  ssr: true,
});

type ChainId = typeof base.id | typeof sepolia.id | typeof anvil.id;

const publicChains = [base, sepolia, anvil] as const;

export const publicClientConfig = {
  [base.id]: {
    chain: base,
    transport: http(),
  },
  [sepolia.id]: {
    chain: sepolia,
    transport: http(),
  },
  [anvil.id]: {
    chain: anvil,
    transport: http(),
  },
} as const satisfies Record<
  ChainId,
  PublicClientConfig & { chain: (typeof publicChains)[number] }
>;

export const viemClient = createClient(publicClientConfig[CHAIN_ID]);
export const viemPublicClient = createPublicClient(
  publicClientConfig[CHAIN_ID],
);
