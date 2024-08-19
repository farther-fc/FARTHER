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
) {
  const fidsOfTippersWhoHaveTippedNonTippers: number[] = [];

  // Need to query like this to not exceed Vercel memory limit
  for (const { id } of tippers) {
    const tipper = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        tipsGiven: {
          where: {
            createdAt: {
              gte: getStartOfMonthUTC(0),
            },
            invalidTipReason: null,
          },
          select: {
            tippee: {
              select: {
                tipAllowances: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const includesTipsToNonTippers = tipper?.tipsGiven.some(
      (tip) => tip.tippee.tipAllowances.length === 0,
    );
    if (includesTipsToNonTippers) {
      fidsOfTippersWhoHaveTippedNonTippers.push(id);
    }
  }

  const tippersWhoHaveTippedNonTippers = tippers.filter((t) =>
    fidsOfTippersWhoHaveTippedNonTippers.includes(t.id),
  );

  const openRankData = (
    await getOpenRankScores({
      fids: tippersWhoHaveTippedNonTippers.map((t) => t.id),
      type: "FOLLOWING",
      rateLimit: 10,
    })
  ).filter((score) => score.rank < TIPPER_OPENRANK_THRESHOLD_REQUIREMENT);

  const openRankFids = openRankData.map((data) => data.fid);

  const orFollowingRankMap = new Map(
    openRankData.map((data) => [data.fid, data.rank]),
  );

  const tippersWithValidOpenRank = tippersWhoHaveTippedNonTippers.filter((t) =>
    openRankFids.includes(t.id),
  );

  const tippersWithEnoughActiveDays = tippersWithValidOpenRank.filter(
    (tipper) => {
      const totalActiveDays = new Set(
        tipper.tipsGiven.map((t) => t.tipAllowanceId),
      ).size;

      return totalActiveDays >= ACTIVE_TIP_DAYS_REQUIRED;
    },
  );

  const rawTippersWithTipsGiven = tippersWithEnoughActiveDays.filter(
    (t) => t.tipsGiven.length > 0,
  );

  const finalFilteredTippers = rawTippersWithTipsGiven.map((user) => ({
    user,
    orFollowingRank: orFollowingRankMap.get(user.id),
  }));
  return finalFilteredTippers;
}

export async function getTippersForLeaderboard() {
  const rawTippers = await getRawLeaderboard();

  const tippers = await getFilteredTippers(rawTippers);

  return tippers;
}
