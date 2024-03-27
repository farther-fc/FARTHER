import { createPublicClient, http } from "viem";
import { base, baseSepolia } from "viem/chains";

if (!process.env.NEXT_PUBLIC_ENVIRONMENT) {
  throw new Error("NEXT_PUBLIC_ENVIRONMENT is not set");
}

export const viemClient = createPublicClient({
  chain:
    process.env.NEXT_PUBLIC_ENVIRONMENT === "production" ? base : baseSepolia,
  transport: http(),
});
