// import { CHAIN_ID } from "@farther/common";
import { CHAIN_ID } from "@farther/common";
import {
  PublicClientConfig,
  createClient,
  createPublicClient,
  http,
} from "viem";
import { anvil, base, sepolia } from "viem/chains";

type ChainId = typeof base.id | typeof sepolia.id | typeof anvil.id;

const publicChains = [base, sepolia, anvil] as const;

export const clientConfig = {
  [base.id]: {
    chain: base,
    transport: http(process.env.BASE_RPC_URL),
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
