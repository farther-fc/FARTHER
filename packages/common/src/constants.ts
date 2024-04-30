import { Address } from "viem";
import { ENVIRONMENT } from "./env";

export const TOTAL_TOKEN_SUPPLY = 1_000_000_000;

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

export const tokenAllocations = {
  powerUserAirdrops: TOTAL_TOKEN_SUPPLY * allocationRatios.POWER_DROPS,
  liquidityRewards: TOTAL_TOKEN_SUPPLY * allocationRatios.LIQUIDITY_REWARDS,
  lpBackstop: TOTAL_TOKEN_SUPPLY * allocationRatios.LIQUIDITY_BACKSTOP,
  evangelistRewards: TOTAL_TOKEN_SUPPLY * allocationRatios.EVANGELIST_REWARDS,
  ecosystemFund: TOTAL_TOKEN_SUPPLY * allocationRatios.ECOSYSTEM_FUND,
  tips: TOTAL_TOKEN_SUPPLY * allocationRatios.TIPS,
  devFund: TOTAL_TOKEN_SUPPLY * allocationRatios.DEV_FUND,
};

export const UNISWAP_REWARDS_PROGRAM_1_AMOUNT =
  tokenAllocations.liquidityRewards / 3; // 50 million

const allocationSum = Object.values(tokenAllocations).reduce(
  (acc, val) => acc + val,
  0,
);

if (allocationSum !== TOTAL_TOKEN_SUPPLY) {
  throw new Error(
    `Token allocations must sum to TOTAL_TOKEN_SUPPLY (${TOTAL_TOKEN_SUPPLY}). Got ${allocationSum} instead.`,
  );
}

export const DEV_DEPLOYER_ADDRESS =
  "0x85ecbfcc3a8a9049e531cd0feeba3dedf5789e60";
export const DEV_USER_ADDRESS = "0xc7c0a4b59de6bec1f9fdac7e760e1300fadd6db2";

export const DEV_USER_FID = 999999999;

export const GIGAMESH_FID = 4378;

export const GIGAMESH_ADDRESS = "0x795050decc0322567c4f0098209d4edc5a69b9d0";

export const DEV_USER_TWITTER_ID = "1355613340324618241";

export const LAUNCH_DATE = new Date("2024-05-01T00:00:00Z");

// Adjust this from month to month as needed
export const BASE_TOKENS_PER_TWEET = TOTAL_TOKEN_SUPPLY / 500_000;

export const ONE_YEAR_IN_MS = 31_536_000_000;

/**
 * IMPORTANT: UPDATE THESE VALUES RIGHT AFTER A NEW AIRDROP IS DEPLOYED!
 */
export const NEXT_AIRDROP_START_TIME = new Date("2024-06-01T00:00:00Z");
export const NEXT_AIRDROP_END_TIME = new Date(
  NEXT_AIRDROP_START_TIME.getTime() + ONE_YEAR_IN_MS,
);
export const POWER_USER_AIRDROP_RATIO = 0.15;

export const TEMPORARY_EVANGELIST_DROP_START_TIME = new Date(
  "2024-06-01T00:00:00Z",
);

const baseContractAddresses = {
  production: {
    FARTHER:
      "0x8ad5b9007556749DE59E088c88801a3Aaa87134B".toLowerCase() as Address,
    WETH: "0x4200000000000000000000000000000000000006".toLowerCase() as Address,
    UNISWAP_V3_STAKER:
      "0x42be4d6527829fefa1493e1fb9f3676d2425c3c1".toLowerCase() as Address,
    UNIV3_FACTORY:
      "0x33128a8fC17869897dcE68Ed026d694621f6FDfD".toLowerCase() as Address,
    NFT_POSITION_MANAGER:
      "0x03a520b32c04bf3beef7beb72e919cf822ed34f1".toLowerCase() as Address,
    UNIV3_FARTHER_ETH_30BPS_POOL:
      "0x306e600e33A9c86B91EeA5A14c8C73F8de62AC84".toLowerCase() as Address,
  },
  staging: {
    FARTHER:
      "0x5b69Edb2434b47978D608fD1CEa375A9Ed04Aa18".toLowerCase() as Address,
    WETH: "0x4200000000000000000000000000000000000006".toLowerCase() as Address,
    UNISWAP_V3_STAKER:
      "0x42be4d6527829fefa1493e1fb9f3676d2425c3c1".toLowerCase() as Address,
    UNIV3_FACTORY:
      "0x33128a8fC17869897dcE68Ed026d694621f6FDfD".toLowerCase() as Address,
    NFT_POSITION_MANAGER:
      "0x03a520b32c04bf3beef7beb72e919cf822ed34f1".toLowerCase() as Address,
    UNIV3_FARTHER_ETH_30BPS_POOL:
      "0xC17Ff8380c09685B2A671E8076c98E5F2eC56832".toLowerCase() as Address,
  },
  development: {
    FARTHER: "0x".toLowerCase() as Address,
    WETH: "0x".toLowerCase() as Address,
    UNIV3_FACTORY: "0x".toLowerCase() as Address,
    UNISWAP_V3_STAKER: "0x".toLowerCase() as Address,
    NFT_POSITION_MANAGER: "0x".toLowerCase() as Address,
    UNIV3_FARTHER_ETH_30BPS_POOL: "0x".toLowerCase() as Address,
  },
} as const;

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

export const IS_INCENTIVE_PROGRAM_ACTIVE = false;

export const incentivePrograms = allIncentivePrograms[ENVIRONMENT];

export const ANVIL_AIRDROP_ADDRESS =
  "0x65Fb1f9Cb54fF76eBCb40b7F9aa4297B49C3Cf1a";

export const WARPCAST_API_BASE_URL = `https://api.warpcast.com/v2/`;

export const NULL_ADDRESS =
  "0x0000000000000000000000000000000000000000" as Address;

export const POINTS_EXPIRATION_MONTHS = 2;

export const EVANGELIST_FOLLOWER_MINIMUM = 80;
