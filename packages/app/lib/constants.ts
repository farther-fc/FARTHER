import { AllocationType } from "@farther/backend";

export const ROUTES = {
  profile: {
    title: "Profile",
    path: "/user/profile",
    type: "user",
    hidden: false,
  },
  tips: {
    title: "Tips",
    path: "/tips",
    type: "feature",
    hidden: false,
  },
  liquidty: {
    title: "Liquidity",
    path: "/liquidity",
    type: "feature",
    hidden: false,
  },
  airdrop: {
    title: "Powerdrops",
    path: "/airdrops",
    type: "feature",
    hidden: false,
  },
  evangelize: {
    title: "Evangelize",
    path: "/evangelize",
    type: "feature",
    hidden: false,
  },
  tokenomics: {
    title: "Tokenomics",
    path: "/tokenomics",
    type: "info",
    hidden: false,
  },
  resources: {
    title: "Resources",
    path: "/resources",
    type: "info",
    hidden: false,
  },
  apiDocs: {
    title: "API Docs",
    path: "/docs/api",
    type: "dev",
    hidden: false,
  },
} as const;

export const FARTHER_CHANNEL_URL = "https://warpcast.com/~/channel/farther";

export const ASSETS_URL =
  "https://www.dropbox.com/scl/fo/ekstm3uwi5fnzot62yzut/AGcz-W2MnCit4ZnBaPfK-90?rlkey=mqbvk5i4hou5u1likn1u3ebyr&st=h1kqaxku&dl=0";

export const POWER_BADGE_INFO_URL = "https://warpcast.com/v/0x0bd49f9c";

export const allocationTypeNames = {
  [AllocationType.POWER_USER]: "Powerdrop",
  [AllocationType.EVANGELIST]: "Evangelist",
  [AllocationType.LIQUIDITY]: "Liquidity (bonus)",
  [AllocationType.TIPS]: "Tips",
};

export const allocationTypeLinks = {
  [AllocationType.POWER_USER]: ROUTES.airdrop.path,
  [AllocationType.EVANGELIST]: ROUTES.evangelize.path,
  [AllocationType.LIQUIDITY]: ROUTES.liquidty.path,
  [AllocationType.TIPS]: ROUTES.tips.path,
};

export const PENDING_POWER_ALLOCATION_ID = "pending-power-drop-allocation";
export const PENDING_TIPS_ALLOCATION_ID = "pending-tips-allocation";

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
  profilePageClaim: "profile-page-claim",
  evangelizePageConnectWallet: "evangelize-page-connect-wallet",
  profilePageClaimedRewards: "profile-page-claimed-rewards",
  claimLiquidityRewards: "claim-liquidity-rewards",
  liquidityInfoBonusRewards: "liquidity-info-bonus-rewards",
  liquidityPendingBonus: "liquidity-pending-bonus",
  liquidityClaimableBonus: "liquidity-claimable-bonus",
  tipsUserInfoConnectWallet: "tips-user-info-connect-wallet",
} as const;

export const POSITIONS_REFRESH_INTERVAL = 10_000;

export const JULY_ANNOUCEMENT_LINK =
  "https://paragraph.xyz/@farther/farther-toward-the-horizon";
