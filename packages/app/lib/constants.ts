import { Allocation, AllocationType } from "@farther/backend";

export const ROUTES = {
  rewards: {
    title: "Rewards",
    path: "/rewards",
  },
  airdrop: {
    title: "Airdrops",
    path: "/airdrops",
  },
  evangelize: {
    title: "Evangelize",
    path: "/evangelize",
  },
  liquidty: {
    title: "Liquidity",
    path: "/liquidity",
  },
  tips: {
    title: "Tips",
    path: "/tips",
  },
  resources: {
    title: "Resources",
    path: "/resources",
  },
};

export const FARTHER_CHANNEL_URL = "https://warpcast.com/~/channel/farther";

export const POWER_BADGE_INFO_URL = "https://warpcast.com/v/0x0bd49f9c";

export const claimNames = {
  [AllocationType.POWER_USER]: "Power User",
  [AllocationType.EVANGELIST]: "Evangelist",
};

export const PENDING_ALLOCATION_ID = "id-for-pending-allocation";

export const pendingAllocation = {
  type: AllocationType.POWER_USER,
  id: PENDING_ALLOCATION_ID,
  isClaimed: false,
  amount: "0",
  airdrop: null,
  index: null,
};
