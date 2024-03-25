export const TOTAL_TOKEN_SUPPLY = 1_000_000_000;
export const TOTAL_AIRDROP_SUPPLY = TOTAL_TOKEN_SUPPLY * 0.3;

// IMPORTANT: UPDATE THESE VALUES WHENEVER A NEW AIRDROP IS CREATED!
export const airdropConfig = {
  VERSION: 1,
  // This should be 1 week from when the merkle root is calculated
  START_TIME: new Date(),
  RATIO: 0.23,
} as const;
