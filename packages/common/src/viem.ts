require("dotenv").config();

import { createPublicClient, http } from "viem";
import { base, sepolia } from "viem/chains";

if (!process.env.NEXT_PUBLIC_ENVIRONMENT) {
  throw new Error("NEXT_PUBLIC_ENVIRONMENT is not set");
}

export const viemClient = createPublicClient({
  chain: process.env.NEXT_PUBLIC_ENVIRONMENT === "production" ? base : sepolia,
  transport: http(),
});
