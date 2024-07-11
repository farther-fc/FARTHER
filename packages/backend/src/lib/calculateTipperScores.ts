import { Tip, prisma } from "../prisma";
import { getLatestTipperAirdrop } from "./getLatestTipperAirdrop";
import { getOpenRankScorePair } from "./getOpenRankScorePair";
import { getRecentTippers } from "./getRecentTippers";

export async function calculateTipperScores() {
  const latestAirdrop = await getLatestTipperAirdrop();
  const tippers = await getRecentTippers(
    latestAirdrop ? latestAirdrop.createdAt : new Date(0),
  );

  const tips = tippers.map((tipper) => tipper.tipsGiven).flat();

  for (const tip of tips) {
    const tipScore = await getTipScore(tip);
  }
}

async function getTipScore(tip: Tip) {
  const [score1, score2] = await getOpenRankScorePair({
    userId: tip.tippeeId,
    startTime: tip.createdAt,
  });
}

async function getScores() {
  const scores = await prisma.openRankScore.findMany({
    where: {
      user: {
        tipsReceived: {
          some: {
            createdAt: {
              gte: new Date("2024-07-10 16:00:49.451"),
            },
          },
        },
      },
    },
  });

  console.log(
    "scores",
    scores.reduce((acc, score) => {
      if (!acc[score.userId]) {
        acc[score.userId] = [];
      }
      acc[score.userId].push(score);
      return acc;
    }, {}),
  );
}

getScores();
