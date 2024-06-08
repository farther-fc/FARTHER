require("dotenv").config();

import { anvil, base, sepolia } from "viem/chains";

if (!process.env.NEXT_PUBLIC_INDEXER_URL) {
  throw new Error("NEXT_PUBLIC_INDEXER_URL is not set");
}

export const NODE_ENV = process.env.NODE_ENV || "development";

const ENV = process.env.NEXT_PUBLIC_ENVIRONMENT || NODE_ENV;

const ENVIRONMENT =
  (["production", "development", "staging"] as const).find((v) => v === ENV) ||
  (() => {
    throw Error(
      `Invalid ENV value: ${ENV}, expected: 'production' | 'staging' | 'development'`,
    );
  })();

export { ENVIRONMENT };

export const isProduction = ENVIRONMENT === "production";

export const NETWORK =
  (["base", "sepolia", "anvil"] as const).find(
    (v) => v === process.env.NEXT_PUBLIC_NETWORK,
  ) ||
  (() => {
    throw Error(
      `Invalid NETWORK value: ${process.env.NEXT_PUBLIC_NETWORK}, expected: 'base' | 'sepolia' | 'anvil'`,
    );
  })();

if (!process.env.NEXT_PUBLIC_BASE_RPC_URL) {
  throw new Error("NEXT_PUBLIC_BASE_RPC_URL is not set");
}

if (!process.env.NEXT_PUBLIC_AIRSTACK_API_KEY) {
  throw new Error("NEXT_PUBLIC_AIRSTACK_API_KEY is not set");
}

export const NEXT_PUBLIC_AIRSTACK_API_KEY =
  process.env.NEXT_PUBLIC_AIRSTACK_API_KEY;

if (!process.env.NEXT_PUBLIC_COINGECKO_API_KEY) {
  throw new Error("NEXT_PUBLIC_COINGECKO_API_KEY is not set");
}

export const NEXT_PUBLIC_COINGECKO_API_KEY =
  process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

export const NEXT_PUBLIC_BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL;

export const chainIds = {
  base: base.id,
  sepolia: sepolia.id,
  anvil: anvil.id,
} as const;

export type ChainId = (typeof chainIds)[typeof NETWORK];

export const CHAIN_ID = chainIds[NETWORK];

export const WAD_SCALER = BigInt(10 ** 18);
