import dayjs from "dayjs";
import { Tip } from "../prisma";
import { getLatestTipperAirdrop } from "./getLatestTipperAirdrop";
import { getOpenRankScorePair } from "./getOpenRankScorePair";
import { getRecentTippers } from "./getRecentTippers";

const SCORE_START_DATE = new Date("2024-07-09T15:00:00.000Z");

export async function calculateTipperScores() {
  const latestAirdrop = await getLatestTipperAirdrop();
  const tippers = await getRecentTippers(
    latestAirdrop ? latestAirdrop.createdAt : SCORE_START_DATE,
  );

  const tips = tippers.map((tipper) => tipper.tipsGiven).flat();

  console.log("processing", tippers.length, "tippers and", tips.length, "tips");

  const tipperScores: { [id: string]: number[] } = {};
  for (const tip of tips) {
    const tipScore = await getTipScore(tip);
    if (!tipperScores[tip.tipperId]) {
      tipperScores[tip.tipperId] = [];
    }
    tipperScores[tip.tipperId].push(tipScore);
  }

  const averagedScores = Object.entries(tipperScores).map(
    ([userId, scores]) => {
      const sum = scores.reduce((acc, score) => acc + score, 0);
      return {
        userId,
        score: sum / scores.length,
      };
    },
  );

  return averagedScores;
}

/**
 * OpenRank score delta per day
 */
async function getTipScore(tip: Tip) {
  const [score1, score2] = await getOpenRankScorePair({
    userId: tip.tippeeId,
    startTime: tip.createdAt,
  });

  const days = dayjs(score2.createdAt).diff(dayjs(score1.createdAt), "day");

  return (score2.score - score1.score) / days;
}

// async function getScores() {
//   const scores = await prisma.openRankScore.findMany({
//     where: {
//       user: {
//         tipsReceived: {
//           some: {
//             createdAt: {
//               gte: new Date("2024-07-10 16:00:49.451"),
//             },
//           },
//         },
//       },
//     },
//   });

//   console.log(
//     "scores",
//     scores.reduce((acc, score) => {
//       if (!acc[score.userId]) {
//         acc[score.userId] = [];
//       }
//       acc[score.userId].push(score);
//       return acc;
//     }, {}),
//   );
// }

// getScores();

calculateTipperScores().then((scores) => {
  const avgScore =
    scores.reduce((acc, score) => acc + score.score, 0) / scores.length;
  const largestScore = scores.reduce(
    (acc, score) => Math.max(acc, score.score),
    0,
  );
  const smallestScore = scores.reduce(
    (acc, score) => Math.min(acc, score.score),
    0,
  );

  console.log("avgScore", avgScore);
  console.log("largestScore", largestScore);
  console.log("smallestScore", smallestScore);
  console.log(
    "biggest winner deviation from avg",
    Math.abs(largestScore - avgScore),
  );
  console.log(
    "biggest loser deviation from avg",
    Math.abs(smallestScore - avgScore),
  );
});
