import { Address } from "viem";
import { anvil, sepolia, base } from "viem/chains";

export const TEST_DEPLOYER_ADDRESS =
  "0x85ecbfcc3a8a9049e531cd0feeba3dedf5789e60";
export const TEST_USER_ADDRESS = "0xc7c0a4b59de6bec1f9fdac7e760e1300fadd6db2";

export const TEST_USER_FID = 999999999;

export const TOTAL_TOKEN_SUPPLY = 1_000_000_000;

export const allocationRatios = {
  POWER_DROPS: 0.3,
  UNI_LP_REWARDS: 0.1,
  LP_BACKSTOP: 0.15,
  EVANGELIST_REWARDS: 0.2,
  ECOSYSTEM_FUND: 0.2,
  DEV_FUND: 0.05,
};

export const LAUNCH_DATE = new Date("2024-05-01T00:00:00Z");
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
    FARTHER: "0xTODO",
    WETH: "0x4200000000000000000000000000000000000006",
    UNISWAP_V3_STAKER: "0x42be4d6527829fefa1493e1fb9f3676d2425c3c1",
    NFT_POSITION_MANAGER: "0x03a520b32c04bf3beef7beb72e919cf822ed34f1",
    UNIV3_FARTHER_ETH_30BPS_POOL: "0x",
  },
  [sepolia.id]: {
    FARTHER: "0x65fb1f9cb54ff76ebcb40b7f9aa4297b49c3cf1a",
    WETH: "0xfff9976782d46cc05630d1f6ebab18b2324d6b14",
    UNISWAP_V3_STAKER: "0x52a941cd52f48a1a7d73d7a07df1e23dd51a699e",
    NFT_POSITION_MANAGER: "0x1238536071e1c677a632429e3655c799b22cda52",
    UNIV3_FARTHER_ETH_30BPS_POOL: "0xee3a8dfc4b22a8c158381a68ed64954faee52ac4",
  },
  [anvil.id]: {
    FARTHER: "0x0850724c967492c535bb748a139f9773caefa618",
    WETH: "0x",
    UNISWAP_V3_STAKER: "0x",
    NFT_POSITION_MANAGER: "0x",
    UNIV3_FARTHER_ETH_30BPS_POOL: "0x",
  },
} as const;

export const uniswapIncentivePrograms = {
  [base.id]: {
    1: {
      // Key computed using getIncentiveKey function
      key: "0xTODO",
      rewardToken: contractAddresses[base.id].FARTHER,
      pool: contractAddresses[base.id].UNIV3_FARTHER_ETH_30BPS_POOL,
      startTime: 0,
      endTime: 0,
      refundee: "0xTODO",
    },
  },
  [sepolia.id]: {
    1: {
      // Key computed using getIncentiveKey function
      key: "0x10442de41f8ca0f375a9e81970138a9cd8c9ba48041f087a0be28a80c82d9bff",
      rewardToken: contractAddresses[sepolia.id].FARTHER,
      pool: contractAddresses[sepolia.id].UNIV3_FARTHER_ETH_30BPS_POOL,
      startTime: 1712278771,
      endTime: 1743814771,
      refundee: TEST_DEPLOYER_ADDRESS,
    },
  },
  [anvil.id]: {
    1: {
      key: "0x",
      rewardToken: "0x",
      pool: "0x",
      startTime: 0,
      endTime: 0,
      refundee: "0x",
    },
  },
} as const;

export const ANVIL_AIRDROP_ADDRESS =
  "0x65Fb1f9Cb54fF76eBCb40b7F9aa4297B49C3Cf1a";

export const networkNames = {
  [base.id]: "base",
  [sepolia.id]: "sepolia",
  [anvil.id]: "anvil",
};

export const WARPCAST_API_BASE_URL = `https://api.warpcast.com/v2/`;

export const NULL_ADDRESS =
  "0x0000000000000000000000000000000000000000" as Address;
