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
    scores[user.id] = user.openRankScores[0] ? user.openRankScores[0].score : 0;
  });

  return scores;
}
