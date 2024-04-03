import { Address } from "viem";
import { anvil, base, sepolia, optimism } from "viem/chains";

export const TEST_USER_ADDRESS = "0xc7c0A4b59De6BEc1f9FDAc7e760E1300FadD6Db2";

export const TEST_USER_FID = 999999999;

export const allocationRatios = {
  POWER_DROPS: 0.3,
  LP_REWARDS: 0.25,
  EVANGELIST_REWARDS: 0.2,
  ECOSYSTEM_FUND: 0.2,
  DEV_FUND: 0.05,
};

export const LAUNCH_DATE = new Date("2024-05-01T00:00:00Z");
export const TOTAL_TOKEN_SUPPLY = 1_000_000_000;
export const TOTAL_POWER_USER_AIRDROP_SUPPLY =
  TOTAL_TOKEN_SUPPLY * allocationRatios.POWER_DROPS;

// IMPORTANT: UPDATE THESE VALUES RIGHT AFTER A NEW AIRDROP IS DEPLOYED!
export const powerUserAirdropConfig = {
  NUMBER: 1,
  // Airdrop 1: 23% of airdrop supply
  // 7 subsequent airdrops: 11% of of airdrop supply
  RATIO: 0.23,
} as const;

export const contractAddresses = {
  [base.id]: {
    TOKEN: "0xTODO",
  },
  [sepolia.id]: {
    TOKEN: "0x65Fb1f9Cb54fF76eBCb40b7F9aa4297B49C3Cf1a",
  },
  [anvil.id]: {
    TOKEN: "0x0850724C967492C535BB748a139f9773CAEfa618",
  },
} as const;

export const ANVIL_AIRDROP_ADDRESS =
  "0x65Fb1f9Cb54fF76eBCb40b7F9aa4297B49C3Cf1a";

export const networkNames = {
  [base.id]: "base",
  [optimism.id]: "optimism",
  [sepolia.id]: "sepolia",
  [anvil.id]: "anvil",
};

export const WARPCAST_API_BASE_URL = `https://api.warpcast.com/v2/`;

export const NULL_ADDRESS =
  "0x0000000000000000000000000000000000000000" as Address;

export const LOCAL_CHAIN_ID = anvil.id;
