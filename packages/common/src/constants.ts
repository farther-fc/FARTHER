import { Address } from "viem";
import { ENVIRONMENT } from "./env";

export const DEV_DEPLOYER_ADDRESS =
  "0x85ecbfcc3a8a9049e531cd0feeba3dedf5789e60";
export const DEV_USER_ADDRESS = "0xc7c0a4b59de6bec1f9fdac7e760e1300fadd6db2";

export const DEV_USER_FID = 999999999;

export const TOTAL_TOKEN_SUPPLY = 50_000_000_000;
export const allocationRatios = {
  POWER_DROPS: 0.25,
  LIQUIDITY_REWARDS: 0.15,
  LIQUIDITY_BACKSTOP: 0.1,
  EVANGELIST_REWARDS: 0.15,
  ECOSYSTEM_FUND: 0.2,
  TIPS: 0.1,
  DEV_FUND: 0.05,
} as const;

if (Object.values(allocationRatios).reduce((acc, val) => acc + val, 0) !== 1)
  throw new Error("Allocation ratios must sum to 1.0");

export const LAUNCH_DATE = new Date("2024-05-01T00:00:00Z");

export const tokenAllocations = {
  powerUserAirdrops: TOTAL_TOKEN_SUPPLY * allocationRatios.POWER_DROPS,
  liquidityRewards: TOTAL_TOKEN_SUPPLY * allocationRatios.LIQUIDITY_REWARDS,
  lpBackstop: TOTAL_TOKEN_SUPPLY * allocationRatios.LIQUIDITY_BACKSTOP,
  evangelistRewards: TOTAL_TOKEN_SUPPLY * allocationRatios.EVANGELIST_REWARDS,
  ecosystemFund: TOTAL_TOKEN_SUPPLY * allocationRatios.ECOSYSTEM_FUND,
  devFund: TOTAL_TOKEN_SUPPLY * allocationRatios.DEV_FUND,
};

// Adjust this from month to month as needed
export const BASE_TOKENS_PER_TWEET = 25_000;

// IMPORTANT: UPDATE THESE VALUES RIGHT AFTER A NEW AIRDROP IS DEPLOYED!
export const powerUserAirdropConfig = {
  NUMBER: 1,
  // Airdrop 1: 12% of airdrop supply
  // The rest is split evenly over 35 subsequent airdrops (3 years)
  RATIO: 0.12,
} as const;

// IMPORTANT: UPDATE THESE VALUES RIGHT AFTER A NEW AIRDROP IS DEPLOYED!
export const evangelistAirdropConfig = {
  NUMBER: 1,
} as const;

const baseContractAddresses = {
  production: {
    FARTHER: "0xTODO" as Address,
    WETH: "0x4200000000000000000000000000000000000006" as Address,
    UNISWAP_V3_STAKER: "0x42be4d6527829fefa1493e1fb9f3676d2425c3c1" as Address,
    UNIV3_FACTORY: "0x33128a8fC17869897dcE68Ed026d694621f6FDfD" as Address,
    NFT_POSITION_MANAGER:
      "0x03a520b32c04bf3beef7beb72e919cf822ed34f1" as Address,
    UNIV3_FARTHER_ETH_30BPS_POOL: "0x" as Address,
  },
  staging: {
    FARTHER: "0x65Fb1f9Cb54fF76eBCb40b7F9aa4297B49C3Cf1a" as Address,
    WETH: "0x4200000000000000000000000000000000000006" as Address,
    UNISWAP_V3_STAKER: "0x42be4d6527829fefa1493e1fb9f3676d2425c3c1" as Address,
    UNIV3_FACTORY: "0x33128a8fC17869897dcE68Ed026d694621f6FDfD" as Address,
    NFT_POSITION_MANAGER:
      "0x03a520b32c04bf3beef7beb72e919cf822ed34f1" as Address,
    UNIV3_FARTHER_ETH_30BPS_POOL:
      "0x0E59d9301fAc8D2d33Cd56212dFBE20B0d178C5d" as Address,
  },
  development: {
    FARTHER: "0x" as Address,
    WETH: "0x" as Address,
    UNIV3_FACTORY: "0x" as Address,
    UNISWAP_V3_STAKER: "0x" as Address,
    NFT_POSITION_MANAGER: "0x" as Address,
    UNIV3_FARTHER_ETH_30BPS_POOL: "0x" as Address,
  },
} as const;

// Sepolia addresses
//   FARTHER: "0x65fb1f9cb54ff76ebcb40b7f9aa4297b49c3cf1a" as Address,
//   WETH: "0xfff9976782d46cc05630d1f6ebab18b2324d6b14" as Address,
//   UNISWAP_V3_STAKER: "0x52a941cd52f48a1a7d73d7a07df1e23dd51a699e" as Address,
//   NFT_POSITION_MANAGER:
//     "0x1238536071e1c677a632429e3655c799b22cda52" as Address,
//   UNIV3_FARTHER_ETH_30BPS_POOL:
//     "0xee3a8dfc4b22a8c158381a68ed64954faee52ac4" as Address,

export const contractAddresses = baseContractAddresses[ENVIRONMENT];

export const allIncentivePrograms = {
  production: {
    1: {
      rewardToken: baseContractAddresses.production.FARTHER,
      pool: "0xTODO",
      startTime: 0,
      endTime: 0,
      refundee: "0xTODO",
    },
  },
  staging: {
    1: {
      rewardToken: baseContractAddresses.staging.FARTHER,
      pool: baseContractAddresses.staging.UNIV3_FARTHER_ETH_30BPS_POOL,
      startTime: 1713835426,
      endTime: 1729387426,
      refundee: DEV_DEPLOYER_ADDRESS,
    },
  },
  development: {
    1: {
      rewardToken: "0x",
      pool: "0x",
      startTime: 0,
      endTime: 0,
      refundee: "0x",
    },
  },
} as const;

export const IS_INCENTIVE_PROGRAM_ACTIVE = true;

export const incentivePrograms = allIncentivePrograms[ENVIRONMENT];

export const ANVIL_AIRDROP_ADDRESS =
  "0x65Fb1f9Cb54fF76eBCb40b7F9aa4297B49C3Cf1a";

export const WARPCAST_API_BASE_URL = `https://api.warpcast.com/v2/`;

export const NULL_ADDRESS =
  "0x0000000000000000000000000000000000000000" as Address;

export const POINTS_EXPIRATION_MONTHS = 2;
