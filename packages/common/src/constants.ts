import { Address } from "viem";
import { ENVIRONMENT, WAD_SCALER } from "./env";

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

export const fundCategoryAddresses = {
  powerDrops: "0xFdc7d762ceFF2a70D2BC92826c37cA1023E8889d",
  liquidity: "0xdd1a2366960Fd1fE67174c18f47089e8911b81C4",
  evangelist: "0x7352D041aFC0eD65D1821f70FD6F6D75C6149339",
  ecosystem: "0x1FBeE539D20dcaF72f31a0f7b4B14F6C4643f369",
  tips: "0xc17b4EE4E9F70dE7B57bD78D02B373fB400f4d18",
  devFund: "0x68299eE09E29e9FA68Bf2670Cebdb6C93f4b7066",
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

// Ledger #3
export const FARTHER_OWNER_ADDRESS =
  "0x97e3B75B2eebCC722B504851416e1410B32180a3";

export const DEV_DEPLOYER_ADDRESS =
  "0xca27037ced432fadf54dee9bc210dfd5ab2f13c8";
export const DEV_USER_ADDRESS = "0x22cb6d209e3d5606ed180bd5ba544622429c47ec";

export const DEV_USER_FID = 999999999;

export const GIGAMESH_FID = 4378;

export const GIGAMESH_ADDRESS = "0x795050decc0322567c4f0098209d4edc5a69b9d0";

export const DEV_USER_TWITTER_ID = "1355613340324618241";

export const LAUNCH_DATE = new Date("2024-05-01T00:00:00Z");

export const ONE_YEAR_IN_MS = 31_536_000_000;

/**
 * IMPORTANT: UPDATE THESE VALUES RIGHT AFTER A NEW AIRDROP IS DEPLOYED!
 */
export const NEXT_AIRDROP_START_TIME = new Date("2024-06-01T00:00:00Z");
export const NEXT_AIRDROP_END_TIME = new Date(
  NEXT_AIRDROP_START_TIME.getTime() + ONE_YEAR_IN_MS,
);

// This ratio was derived by attempting to make the maximum power user allocation
// for the second airdrop match the first.
// This allows for more growth later rather than evenly splitting the allocation between
// every month over 3 years. Also creates more equitable distribution.
export const POWER_USER_AIRDROP_RATIO = 0.01;

export const baseContractAddresses = {
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
      "0xf9A98fDC95A427fCfB1506A6E8A3143119417fBA".toLowerCase() as Address,
    WETH: "0x4200000000000000000000000000000000000006".toLowerCase() as Address,
    UNISWAP_V3_STAKER:
      "0x42be4d6527829fefa1493e1fb9f3676d2425c3c1".toLowerCase() as Address,
    UNIV3_FACTORY:
      "0x33128a8fC17869897dcE68Ed026d694621f6FDfD".toLowerCase() as Address,
    NFT_POSITION_MANAGER:
      "0x03a520b32c04bf3beef7beb72e919cf822ed34f1".toLowerCase() as Address,
    UNIV3_FARTHER_ETH_30BPS_POOL:
      "0x2453274556565Eb7c2f2411673b0301D2570e6Cf".toLowerCase() as Address,
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
      pool: baseContractAddresses.production.UNIV3_FARTHER_ETH_30BPS_POOL,
      startTime: 1714521600,
      endTime: 1730073600,
      refundee: FARTHER_OWNER_ADDRESS,
      incentiveKey:
        "0x0000000000000000000000008ad5b9007556749de59e088c88801a3aaa87134b000000000000000000000000306e600e33a9c86b91eea5a14c8c73f8de62ac84000000000000000000000000000000000000000000000000000000006631860000000000000000000000000000000000000000000000000000000000671ed40000000000000000000000000097e3b75b2eebcc722b504851416e1410b32180a3",
      incentiveKeyHash:
        "0xa58a83a037772128595cff86b9f106c4246c8f440949e51e69fd1b68f7eacc7c",
    },
  },
  staging: {
    1: {
      rewardToken: baseContractAddresses.staging.FARTHER,
      pool: baseContractAddresses.staging.UNIV3_FARTHER_ETH_30BPS_POOL,
      startTime: 1715835354,
      endTime: 1731387354,
      refundee: DEV_DEPLOYER_ADDRESS,
      incentiveKey:
        "0x000000000000000000000000f9a98fdc95a427fcfb1506a6e8a3143119417fba0000000000000000000000002453274556565eb7c2f2411673b0301d2570e6cf00000000000000000000000000000000000000000000000000000000664591da000000000000000000000000000000000000000000000000000000006732dfda000000000000000000000000ca27037ced432fadf54dee9bc210dfd5ab2f13c8",
      incentiveKeyHash:
        "0x0b8006b7331602d0c8185d846bbc320028a627ad85b96b6ccd6cbdfbc3f58169",
    },
  },
  development: {
    1: {
      rewardToken: "0x",
      pool: "0x",
      startTime: 0,
      endTime: 0,
      refundee: "0x",
      incentiveKey: "0x",
      incentiveKeyHash: "0x",
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

// Adjust this from month to month as needed
export const TWEET_BASE_TOKENS = 500;

export const TWEET_FARTHER_BONUS_MULTIPLIER = 1.2;

export const LIQUIDITY_BONUS_MULTIPLIER = 5;

export const EVANGELIST_FOLLOWER_MINIMUM = 80;

export const EVANGELIST_FOLLOWER_BONUS_MULTIPLE = 10;

export const TIPS_DURATION_DAYS = 180;

export const DUST_AMOUNT = 1000000;

export const START_BLOCK = ENVIRONMENT === "staging" ? 13817650 : 13832035;

export const TIPPER_BALANCE_MIN_WAD = BigInt(10_000) * WAD_SCALER;

export const TIP_USD_MINIMUM = 0.5;

export const PRICE_REFRESH_TIME = 20 * 60 * 1000; // 20 minutes

export const INITIAL_ELIGIBLE_TIPPERS =
  ENVIRONMENT !== "development" || Boolean(process.env.PROD_AGENT_MODELING)
    ? 100
    : 10;

export const ADDITIONAL_TIPPERS_INCREMENT = 5;

export const REQUIRED_DOLLAR_VALUE_PER_TIPPER = 20;

export const ROOT_ENDPOINTS = {
  production: "https://farther.social",
  staging: "https://staging.farther.social",
  development: "http://localhost:3000",
} as const;

export const ROOT_ENDPOINT =
  ROOT_ENDPOINTS[
    process.env.NEXT_PUBLIC_ENV as "production" | "staging" | "development"
  ];

export const HANDLE_TIP_REGEX =
  ENVIRONMENT === "production"
    ? /\d+(\.\d+)?\s*(\$(f|F)(a|A)(r|R)(t|T)(h|H)(e|E)(r|R)|((f|F)(a|A)(r|R)(t|T)(h|H)(e|E)(r|R))|✨)/
    : /\d+(\.\d+)?\s*(\$(f|F)(t|T)(e|E)(s|S)(t|T)|(f|F)(t|T)(e|E)(s|S)(t|T))/;
