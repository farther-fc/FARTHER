import { prisma } from "@farther/backend";
import {
  ENVIRONMENT,
  TIPPER_REWARDS_POOL,
  cacheTypes,
  getStartOfMonthUTC,
} from "@farther/common";
import { dummyLeaderBoard } from "@lib/__tests__/testData";
import { cache } from "@lib/cache";

export async function tipsLeaderboard() {
  const cachedLeaderboard = await cache.get({
    type: cacheTypes.LEADERBOARD,
  });

  if (cachedLeaderboard) {
    return cachedLeaderboard;
  }

  const leaderboardData = await getLeaderboardData();

  cache.set({ type: cacheTypes.LEADERBOARD, value: leaderboardData });

  return leaderboardData;
}

export async function getLeaderboardData() {
  if (ENVIRONMENT === "development") {
    return dummyLeaderBoard;
  }

  const currentTipMeta = await prisma.tipMeta.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  if (!currentTipMeta) {
    return [];
  }

  const tippers = await prisma.user.findMany({
    where: {
      tipsGiven: {
        some: {
          invalidTipReason: null,
          createdAt: {
            // TODO: change this to whenever snapshot happens!
            gte: getStartOfMonthUTC(0),
          },
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
        where: {
          createdAt: {
            // TODO: change this to whenever snapshot happens!
            gte: getStartOfMonthUTC(0),
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

  const totalTipperScore = tippers
    .map((tipper) => tipper.tipperScores[0]?.score ?? 0)
    .reduce((acc, score) => acc + score, 0);

  const leaderboardData = tippers.map((tipper, i) => {
    const tipperScore = tipper.tipperScores[0]?.score ?? 0;

    const tipperRewards = Math.max(
      0,
      (tipperScore / totalTipperScore) * TIPPER_REWARDS_POOL,
    );

    const seasonGivenCount = tipper.tipsGiven.length;
    const seasonGivenAmount = tipper.tipsGiven.reduce(
      (acc, t) => acc + t.amount,
      0,
    );

    return {
      fid: tipper.id,
      displayName: tipper.displayName,
      pfpUrl: tipper.pfpUrl,
      username: tipper.username,
      powerBadge: tipper.powerBadge,
      tipperScore,
      tipperRewards,
      currentAllowance:
        tipper.tipAllowances[0].tipMetaId === currentTipMeta.id
          ? tipper.tipAllowances[0].amount
          : 0,
      totalAllowance: Math.round(
        tipper.tipAllowances.reduce(
          (acc, allowance) => acc + allowance.amount,
          0,
        ),
      ),
      seasonGivenCount,
      seasonGivenAmount,
      totalGivenCount: tipper.tipAllowances.reduce(
        (acc, ta) => acc + ta.tips.length,
        0,
      ),
      totalGivenAmount: Math.round(
        tipper.tipAllowances.reduce(
          (acc, ta) => acc + ta.tips.reduce((acc, tip) => acc + tip.amount, 0),
          0,
        ),
      ),
    };
  });

  const rankedData = leaderboardData
    .sort((a, b) => b.tipperScore - a.tipperScore)
    .map((d, i) => ({
      ...d,
      rank: i + 1,
    }));

  return rankedData;
}
