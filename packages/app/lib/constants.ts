import { AirdropType } from "@backend/prisma";

export const ROUTES = {
  tokenomics: {
    title: "Tokenomics",
    path: "/tokenomics",
    hidden: false,
  },
  airdrop: {
    title: "Airdrops",
    path: "/airdrops",
    hidden: false,
  },
  evangelize: {
    title: "Evangelize",
    path: "/evangelize",
    hidden: false,
  },
  liquidty: {
    title: "Liqudity",
    path: "/liquidity",
    hidden: false,
  },
  claims: {
    title: "Claims",
    path: "/claims",
    hidden: true,
  },
};

export const FARTHER_CHANNEL_URL = "https://warpcast.com/~/channel/farther";

export const claimNames = {
  [AirdropType.POWER_USER]: "Power User",
  [AirdropType.EVANGELIST]: "Evangelist",
};
