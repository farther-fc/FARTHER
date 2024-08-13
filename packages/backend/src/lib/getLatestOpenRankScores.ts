import { prisma } from "../prisma";

export async function getLatestOpenRankScores(fids: number[]) {
  const data = await prisma.user.findMany({
    where: {
      id: {
        in: fids,
      },
    },
    select: {
      id: true,
      openRankScores: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          score: true,
        },
      },
    },
  });

  const scores: { [fid: number]: number } = {};

  data.forEach((user) => {
    // Only returns a score for a FID if one exists
    if (!user.openRankScores[0]) return;

    scores[user.id] = user.openRankScores[0].score;
  });

  return scores;
}
