import { base, baseSepolia } from "viem/chains";

export const TOTAL_TOKEN_SUPPLY = 1_000_000_000;
export const TOTAL_AIRDROP_SUPPLY = TOTAL_TOKEN_SUPPLY * 0.3;

// IMPORTANT: UPDATE THESE VALUES WHENEVER A NEW AIRDROP IS CREATED!
export const airdropConfig = {
  VERSION: 1,
  // This should be 1 week from when the merkle root is calculated
  START_TIME: new Date(),
  // Airdrop 1: 23% of airdrop supply
  // 7 subsequent airdrops: 11% of of airdrop supply
  RATIO: 0.23,
} as const;

export const contractAddresses = {
  [base.id]: {
    TOKEN: "0xTODO",
    AIRDROP_1: "0xTODO",
  },
  [baseSepolia.id]: {
    TOKEN: "0x84530cdBfD5E73e58c9CE6B4EF35DB422709B995",
    AIRDROP_1: "0x1d8f4AF1EbAfa1e310a10c59cCb31Bf75D81cC26",
  },
} as const;

export const networkNames = {
  8453: "base",
  84532: "base-sepolia",
  10: "optimism",
  11155420: "op-sepolia",
  11155111: "sepolia",
};

export const WARPCAST_API_BASE_URL = `https://api.warpcast.com/v2/`;
