import { isProduction } from "@common/env";
import { Alchemy, Network } from "alchemy-sdk";

if (!process.env.ALCHEMY_API_KEY) {
  throw new Error("ALCHEMY_API_KEY is not set");
}

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: isProduction ? Network.BASE_MAINNET : Network.BASE_SEPOLIA,
};

export const alchemy = new Alchemy(config);
