import { AllocationType } from "@farther/backend";

export const ROUTES = {
  rewards: {
    title: "Rewards",
    path: "/rewards",
    type: "user",
  },
  airdrop: {
    title: "Airdrops",
    path: "/airdrops",
    type: "user",
  },
  evangelize: {
    title: "Evangelize",
    path: "/evangelize",
    type: "user",
  },
  liquidty: {
    title: "Liquidity",
    path: "/liquidity",
    type: "user",
  },
  tips: {
    title: "Tips",
    path: "/tips",
    type: "user",
  },
  tokenomics: {
    title: "Tokenomics",
    path: "/tokenomics",
    type: "info",
  },
  resources: {
    title: "Resources",
    path: "/resources",
    type: "info",
  },
} as const;

export const FARTHER_CHANNEL_URL = "https://warpcast.com/~/channel/farther";

export const ASSETS_URL =
  "https://www.dropbox.com/scl/fo/ekstm3uwi5fnzot62yzut/AGcz-W2MnCit4ZnBaPfK-90?rlkey=mqbvk5i4hou5u1likn1u3ebyr&st=h1kqaxku&dl=0";

export const POWER_BADGE_INFO_URL = "https://warpcast.com/v/0x0bd49f9c";

export const allocationTypeNames = {
  [AllocationType.POWER_USER]: "Power User",
  [AllocationType.EVANGELIST]: "Evangelist",
  [AllocationType.LIQUIDITY]: "Liquidity Provider",
};

export const allocationTypeLinks = {
  [AllocationType.POWER_USER]: ROUTES.airdrop.path,
  [AllocationType.EVANGELIST]: ROUTES.evangelize.path,
  [AllocationType.LIQUIDITY]: ROUTES.liquidty.path,
};

export const PENDING_ALLOCATION_ID = "id-for-pending-allocation";

export const ROOT_ENDPOINTS = {
  production: "https://farther.social",
  staging: "https://staging.farther.social",
  development: "http://localhost:3000",
} as const;

export const ROOT_ENDPOINT =
  ROOT_ENDPOINTS[
    process.env.NEXT_PUBLIC_ENV as "production" | "staging" | "development"
  ];

export const clickIds = {
  liqInfoConnect: "liquidity-info-connect-wallet",
  liqTableRowStakeUnstake: "liquidity-table-row-stake-unstake",
  rewardsTableRowStakeUnstake: "rewards-table-row-stake-unstake",
  submitTweet: "submit-tweet",
  ecosystemFundOpenModal: "ecosystem-fund-open-modal",
  founderAllocationOpenModal: "founder-allocation-open-modal",
  closeModal: "close-modal",
  openHeaderNavMenu: "open-header-nav-menu",
  openProfileMenu: "open-profile-menu",
  disconnectWallet: "disconnect-wallet",
  connectWallet: "connect-wallet",
  airdropPageConnectWallet: "airdrop-page-connect-wallet",
  liquidtyPageConnectWallet: "liquidity-page-connect-wallet",
  rewardsPageConnectWallet: "rewards-page-connect-wallet",
  rewardsPageClaim: "rewards-page-claim",
  evangelizePageConnectWallet: "evangelize-page-connect-wallet",
  rewardsPageClaimedRewards: "rewards-page-claimed-rewards",
  claimLiquidityRewards: "claim-liquidity-rewards",
  liquidityInfoBonusRewards: "liquidity-info-bonus-rewards",
  liquidityPendingBonus: "liquidity-pending-bonus",
  liquidityClaimableBonus: "liquidity-claimable-bonus",
} as const;

export const POSITIONS_REFRESH_INTERVAL = 3000;
