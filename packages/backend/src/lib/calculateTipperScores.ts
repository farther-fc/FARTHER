import { prisma } from "../prisma";
import { getLatestTipperAirdrop } from "./getLatestTipperAirdrop";

export async function calculateTipperScores() {
  const latestAirdrop = await getLatestTipperAirdrop();

  const tipsThisSeason = await getTipsSince(
    latestAirdrop ? latestAirdrop.createdAt : new Date(0),
  );
}

async function getTipsSince(date: Date) {
  return await prisma.tip.findMany({
    where: {
      invalidTipReason: null,
      createdAt: {
        gte: date,
      },
    },
  });
}
