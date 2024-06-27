import { prisma } from "@farther/backend";
import { ENVIRONMENT, neynarLimiter } from "@farther/common";
import { kv } from "@vercel/kv";
import { leaderboardDummyData } from "server/tips/dummyData/leaderboard";

const key = `TIPS_LEADERBOARD`;

const ONE_DAY = 24 * 60 * 60;

export async function tipsLeaderboard() {
  const cachedLeaderboard =
    await kv.get<Awaited<ReturnType<typeof getLeaderboardData>>>(key);

  if (cachedLeaderboard) {
    console.info("Cache hit for leaderboard data");

    return cachedLeaderboard;
  }

  console.info("Cache miss for leaderboard data");

  const leaderboardData = await getLeaderboardData();

  kv.set(key, leaderboardData, { ex: ONE_DAY });

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
        },
      },
    },
    select: {
      id: true,
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

  const userData = await neynarLimiter.getUsersByFid(tippers.map((t) => t.id));

  const leaderboardData = tippers.map((tipper, i) => ({
    fid: tipper.id,
    displayName: userData[i].display_name,
    pfpUrl: userData[i].pfp_url,
    username: userData[i].username,
    powerBadge: userData[i].power_badge,
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
  }));

  leaderboardData.sort((a, b) => b.currentAllowance - a.currentAllowance);

  return leaderboardData;
}

export const flushLeaderboardCache = () => {
  kv.flushall();
};
