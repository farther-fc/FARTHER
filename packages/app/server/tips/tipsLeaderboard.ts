import { prisma } from "@farther/backend";
import { ENVIRONMENT, neynarLimiter } from "@farther/common";
import NodeCache from "node-cache";
import { leaderboardDummyData } from "server/tips/dummyData/leaderboard";
import { publicProcedure } from "server/trpc";

const key = `TIPS_LEADERBOARD`;
const cache = new NodeCache({ stdTTL: 24 * 60 * 60 }); // 24 hours

export const publicTipsLeaderboard = publicProcedure.query(async () => {
  if (ENVIRONMENT === "development") {
    return leaderboardDummyData;
  }

  const cachedLeaderboard = cache.get(key);

  if (cachedLeaderboard) {
    console.info("Cache hit for leaderboard data");

    return cachedLeaderboard as Awaited<ReturnType<typeof getLeaderboardData>>;
  }

  console.info("Cache miss for leaderboard data");

  const leaderboardData = await getLeaderboardData();

  cache.set(key, leaderboardData);

  return leaderboardData;
});

async function getLeaderboardData() {
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
            select: {
              amount: true,
            },
          },
        },
      },
    },
  });

  const userData = await neynarLimiter.getUsersByFid(tippers.map((t) => t.id));

  return tippers.map((tipper, i) => ({
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
}

export const flushLeaderboardCache = () => {
  cache.flushAll();
};
