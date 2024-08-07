import { getOpenRankScores } from "@farther/common";
import { writeFile } from "fs/promises";
import { prisma } from "../prisma";

const RATE_LIMIT = 10;

async function openRankResearch() {
  const usersWithoutPb = await prisma.user.findMany({
    where: {
      powerBadge: false,
      openRankScores: {
        some: {},
      },
    },
    take: 2000,
  });
  const usersWithPb = await prisma.user.findMany({
    where: {
      powerBadge: true,
      openRankScores: {
        some: {},
      },
    },
    take: 2000,
  });

  const scoresWithoutPb = await getOpenRankScores({
    fids: usersWithoutPb.map((u) => u.id),
    type: "FOLLOWING",
    rateLimit: RATE_LIMIT,
  });

  const scoresWithPb = await getOpenRankScores({
    fids: usersWithPb.map((u) => u.id),
    type: "FOLLOWING",
    rateLimit: RATE_LIMIT,
  });

  // Descending by score
  const sortedScoresWithoutPb = scoresWithoutPb.sort(
    (a, b) => b.score - a.score,
  );

  // Ascending by score
  const sortedScoresWithPb = scoresWithPb.sort((a, b) => a.score - b.score);

  const highestOpenRankScoreWithoutPb = sortedScoresWithoutPb[0];
  const lowestOpenRankScoreWithPb = sortedScoresWithPb[0];

  console.info(
    `Highest open rank score without power badge: ${JSON.stringify(highestOpenRankScoreWithoutPb, null, 2)}`,
  );
  console.info(
    `Lowest open rank score with power badge: ${JSON.stringify(lowestOpenRankScoreWithPb, null, 2)}`,
  );
}

async function followingScoresOfTippers() {
  const tippers = await prisma.user.findMany({
    where: {
      tipsGiven: {
        some: {
          createdAt: {
            gte: new Date("2024-08-01"),
          },
        },
      },
    },
  });

  const scores = await getOpenRankScores({
    fids: tippers.map((t) => t.id),
    type: "FOLLOWING",
    rateLimit: RATE_LIMIT,
  });

  const sortedScores = scores.sort((a, b) => b.score - a.score);

  const median = sortedScores[Math.floor(sortedScores.length / 2)].score;

  const withMedianDeviations = sortedScores.map((s) => ({
    username: s.username,
    score: s.score,
    rank: s.rank,
    medianDeviation: s.score - median,
  }));

  const largestMedianDeviation = Math.max(
    ...withMedianDeviations.map((score) => Math.abs(score.medianDeviation)),
  );

  const finalValues = withMedianDeviations.map((s) => ({
    username: s.username,
    score: s.score,
    rank: s.rank,
    medianDeviation: `${((s.medianDeviation / largestMedianDeviation) * 100).toLocaleString()}%`,
  }));

  writeFile("sortedScores.json", JSON.stringify(finalValues, null, 2));

  // const highestOpenRankScore = sortedScores[0];
  // const lowestOpenRankScore = sortedScores[scores.length - 1];

  // console.info(
  //   `Highest open rank score of tippers: ${JSON.stringify(highestOpenRankScore, null, 2)}`,
  // );
  // console.info(
  //   `Lowest open rank score of tippers: ${JSON.stringify(lowestOpenRankScore, null, 2)}`,
  // );
}

// openRankRsesearch();
followingScoresOfTippers();
