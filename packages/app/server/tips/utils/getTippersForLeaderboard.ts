import { prisma } from "@farther/backend";
import { dayUTC, getOpenRankScores, getStartOfMonthUTC } from "@farther/common";

export const activeTipDaysRulesStartTime = dayUTC("2024-08-08");

export async function getTippersForLeaderboard() {
  const latestSnapshot = await prisma.tipperScoreSnapshot.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  if (!latestSnapshot) {
    console.error("No tipper score snapshot found");
    return [];
  }

  const tippers = await prisma.user.findMany({
    where: {
      tipperScores: {
        some: {
          snapshotId: latestSnapshot?.id,
        },
      },
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      pfpUrl: true,
      powerBadge: true,
      tipperScores: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      tipsGiven: {
        where: {
          invalidTipReason: null,
          createdAt: {
            gte: getStartOfMonthUTC(0),
          },
        },
      },
      tipAllowances: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          createdAt: true,
          amount: true,
          tipMetaId: true,
          tips: {
            where: {
              invalidTipReason: null,
            },
            select: {
              amount: true,
            },
          },
        },
      },
    },
  });

  const openRankData = await getOpenRankScores({
    fids: tippers.map((t) => t.id),
    type: "FOLLOWING",
    rateLimit: 10,
  });

  const orFollowingRankMap = new Map(
    openRankData.map((data) => [data.fid, data.rank]),
  );

  return tippers.map((user) => ({
    user,
    orFollowingRank: orFollowingRankMap.get(user.id),
  }));
}
