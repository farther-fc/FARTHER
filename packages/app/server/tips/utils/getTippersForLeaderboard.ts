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
  const openRankScores = (
    await getOpenRankScores({
      fids: tippers.map((t) => t.id),
      type: "FOLLOWING",
      rateLimit: 10,
    })
  )
    .filter((score) => score.rank < TIPPER_OPENRANK_THRESHOLD_REQUIREMENT)
    .map((score) => score.fid);

  return tippers.filter((tipper) => {
    const totalActiveDays = new Set(
      tipper.tipsGiven.map((t) => t.tipAllowanceId),
    ).size;

    const firstTip = tipper.tipsGiven.reduce((acc, t) => {
      if (t.createdAt < acc) {
        return t.createdAt;
      }
      return acc;
    }, tipper.tipsGiven[0].createdAt);

    // Must meet threshold if they started tipping more than ACTIVE_TIP_DAYS_REQUIRED days ago
    const requireActiveDaysThreshold =
      dayUTC(now).diff(firstTip, "day", true) > ACTIVE_TIP_DAYS_REQUIRED ||
      /// TODO: Remove after 8/13/2024 (will no longer be needed then)
      !openRankScores.includes(tipper.id);

    return requireActiveDaysThreshold
      ? totalActiveDays >= ACTIVE_TIP_DAYS_REQUIRED
      : true;
  });
}

export async function getTippersForLeaderboard() {
  const rawTippers = await getRawLeaderboard();
  const tippers = await getFilteredTippers(rawTippers);

  return tippers;
}
