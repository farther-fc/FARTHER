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

export const defaultChainId = isProduction
  ? base.id
  : ENVIRONMENT === "staging"
    ? sepolia.id
    : anvil.id;
