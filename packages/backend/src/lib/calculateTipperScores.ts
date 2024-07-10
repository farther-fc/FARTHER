import { prisma } from "../prisma";
import { getLatestTipperAirdrop } from "./getLatestTipperAirdrop";

export async function calculateTipperScores() {
  const latestAirdrop = await getLatestTipperAirdrop();

  const tipsThisSeason = await getTipsSince(latestAirdrop.createdAt);
}

async function getTipsSince(date: Date) {
  return await prisma.tip.findMany({
    where: {
      createdAt: {
        gte: date,
      },
    },
  });
}
