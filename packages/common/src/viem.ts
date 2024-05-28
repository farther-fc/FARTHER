import {
  PublicClientConfig,
  createClient,
  createPublicClient,
  http,
} from "viem";
import { anvil, base, sepolia } from "viem/chains";
import { CHAIN_ID, NEXT_PUBLIC_BASE_RPC_URL } from "./env";

type ChainId = typeof base.id | typeof sepolia.id | typeof anvil.id;

const publicChains = [base, sepolia, anvil] as const;

export const clientConfig = {
  [base.id]: {
    chain: base as any,
    transport: http(NEXT_PUBLIC_BASE_RPC_URL),
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

export const viemClient = createClient(clientConfig[CHAIN_ID]);
export const viemPublicClient = createPublicClient(clientConfig[CHAIN_ID]);
