require("dotenv").config();

import { base, sepolia, anvil } from "viem/chains";

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

export const chainIds = {
  base: base.id,
  sepolia: sepolia.id,
  anvil: anvil.id,
} as const;

export const CHAIN_ID = chainIds[NETWORK];

export const WAD_SCALER = BigInt(10 ** 18);
