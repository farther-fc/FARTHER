import { prisma } from "@farther/backend";
import {
  ACTIVE_TIP_DAYS_REQUIRED,
  FARTHER_OWNER_FID,
  TIPPER_OPENRANK_THRESHOLD_REQUIREMENT,
  dayUTC,
  getOpenRankScores,
  getStartOfMonthUTC,
} from "@farther/common";

export const activeTipDaysRulesStartTime = dayUTC("2024-08-08");

export async function getRawLeaderboard(now = dayUTC()) {
  return await prisma.user.findMany({
    where: {
      id: {
        not: FARTHER_OWNER_FID,
      },
      tipsGiven: {
        some: {
          invalidTipReason: null,
          createdAt: {
            // TODO: change this to whenever snapshot happens!
            gte: getStartOfMonthUTC(0),
            lt: now.toDate(),
          },
        },
      },
      isBanned: false,
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      pfpUrl: true,
      powerBadge: true,
      tipperScores: {
        where: {
          createdAt: {
            // TODO: change this to whenever snapshot happens!
            gte: getStartOfMonthUTC(0),
            lt: now.toDate(),
          },
        },
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
            lt: now.toDate(),
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
}

export async function getFilteredTippers(
  tippers: Awaited<ReturnType<typeof getRawLeaderboard>>,
  now = dayUTC(),
) {
  // TODO: Remove after 8/13/2024 (will no longer be needed then)
  const openRankData = (
    await getOpenRankScores({
      fids: tippers.map((t) => t.id),
      type: "FOLLOWING",
      rateLimit: 10,
    })
  ).filter((score) => score.rank < TIPPER_OPENRANK_THRESHOLD_REQUIREMENT);

  const openRankFids = openRankData.map((data) => data.fid);

  const orFollowingRankMap = new Map(
    openRankData.map((data) => [data.fid, data.rank]),
  );

  return tippers
    .map((user) => ({
      user,
      orFollowingRank: orFollowingRankMap.get(user.id),
    }))
    .filter((tipper) => {
      const totalActiveDays = new Set(
        tipper.user.tipsGiven.map((t) => t.tipAllowanceId),
      ).size;

      return (
        openRankFids.includes(tipper.user.id) &&
        totalActiveDays >= ACTIVE_TIP_DAYS_REQUIRED
      );
    });
}

export async function getTippersForLeaderboard() {
  const rawTippers = await getRawLeaderboard();

  const tippers = await getFilteredTippers(rawTippers);

  return tippers;
}
