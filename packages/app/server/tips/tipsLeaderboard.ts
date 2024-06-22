import { prisma } from "@farther/backend";
import { neynarLimiter } from "@farther/common";
import NodeCache from "node-cache";
import { adminProcedure, publicProcedure } from "server/trpc";

const key = `TIPS_LEADERBOARD`;
const cache = new NodeCache({ stdTTL: 24 * 60 * 60 }); // 24 hours

export const tipsLeaderboard = publicProcedure.query(async () => {
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

export const flushLeaderboardCache = adminProcedure.query(async () => {
  cache.flushAll();
  return true;
});

async function getLeaderboardData() {
  const currentTipMeta = await prisma.tipMeta.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
    include: {
      allowances: {
        include: {
          user: {
            select: {
              id: true,
              tipsReceived: {
                where: {
                  invalidTipReason: null,
                },
              },
            },
          },
          tips: {
            where: {
              invalidTipReason: null,
            },
          },
        },
      },
    },
  });

  if (!currentTipMeta) {
    return [];
  }

  const userData = await neynarLimiter.getUsersByFid(
    currentTipMeta.allowances.map((a) => a.user.id),
  );

  return currentTipMeta.allowances.map((a, i) => ({
    fid: a.user.id,
    displayName: userData[i].display_name,
    pfpUrl: userData[i].pfp_url,
    username: userData[i].username,
    powerBadge: userData[i].power_badge,
    tips: {
      allowance: a.amount,
      givenCount: a.tips.length,
      givenAmount: a.tips.reduce((acc, tip) => acc + tip.amount, 0),
      receivedCount: a.user.tipsReceived.length,
      receivedAmount: a.user.tipsReceived.reduce(
        (acc, tip) => acc + tip.amount,
        0,
      ),
    },
  }));
}
