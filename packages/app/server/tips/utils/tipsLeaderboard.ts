import { prisma } from "@farther/backend";
import { ENVIRONMENT, cacheKeys, cacheTimes } from "@farther/common";
import { kv } from "@vercel/kv";
import { leaderboardDummyData } from "../dummyData/leaderboard";

export async function tipsLeaderboard() {
  const cachedLeaderboard = await kv.get<
    Awaited<ReturnType<typeof getLeaderboardData>>
  >(cacheKeys.LEADERBOARD);

  if (cachedLeaderboard) {
    console.info("Cache hit for leaderboard data");

    return cachedLeaderboard;
  }

  console.info("Cache miss for leaderboard data");

  const leaderboardData = await getLeaderboardData();

  kv.set(cacheKeys.LEADERBOARD, leaderboardData, {
    ex: cacheTimes.LEADERBOARD,
  });

  return leaderboardData;
}

async function getLeaderboardData() {
  if (ENVIRONMENT === "development") {
    return leaderboardDummyData;
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
        },
      },
      tipAllowances: {
        some: {
          tipMetaId: currentTipMeta.id,
          invalidatedAmount: null,
        },
      },
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      pfpUrl: true,
      powerBadge: true,
      tipScores: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      tipAllowances: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          amount: true,
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

  const leaderboardData = tippers.map((tipper, i) => {
    return {
      fid: tipper.id,
      displayName: tipper.displayName,
      pfpUrl: tipper.pfpUrl,
      username: tipper.username,
      powerBadge: tipper.powerBadge,
      tipperScore: tipper.tipScores[0]?.score ?? 0,
      currentAllowance: tipper.tipAllowances[0].amount,
      totalAllowance: Math.round(
        tipper.tipAllowances.reduce(
          (acc, allowance) => acc + allowance.amount,
          0,
        ),
      ),
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
    .sort((a, b) => b.totalGivenAmount - a.totalGivenAmount)
    .map((d, i) => ({
      ...d,
      rank: i + 1,
    }));

  return rankedData;
}

export const flushCache = () => {
  kv.flushall();
};
