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
