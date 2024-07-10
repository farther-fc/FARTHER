import { prisma } from "../prisma";
import { getLatestTipperAirdrop } from "./getLatestTipperAirdrop";

export async function getSeasonTippers() {
  const latestAirdrop = await getLatestTipperAirdrop();
  return await prisma.user.findMany({
    where: {
      tipsGiven: {
        some: {
          invalidTipReason: null,
          createdAt: {
            gte: latestAirdrop ? latestAirdrop.createdAt : new Date(0),
          },
        },
      },
    },
    include: {
      tipsGiven: true,
    },
  });
}
