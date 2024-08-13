import { prisma } from "@farther/backend";
import {
  ENVIRONMENT,
  TIPPER_OPENRANK_THRESHOLD_REQUIREMENT,
  TIPPER_REWARDS_POOL,
  cacheTypes,
  getOpenRankScores,
} from "@farther/common";
import { dummyLeaderBoard } from "@lib/__tests__/testData";
import { cache } from "@lib/cache";
import { getTippersForLeaderboard } from "server/tips/utils/getTippersForLeaderboard";

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

  const tippers = await getTippersForLeaderboard();

  // TODO: Get this data from DB after we start syncing it
  const openRankStatsArr = await getOpenRankScores({
    fids: tippers.map((t) => t.id),
    type: "FOLLOWING",
  });

  const ranks = openRankStatsArr.reduce(
    (acc, d) => {
      acc[d.fid] = d.rank;
      return acc;
    },
    {} as Record<string, number>,
  );

  const filteredTippers = tippers.filter(
    (t) => ranks[t.id] < TIPPER_OPENRANK_THRESHOLD_REQUIREMENT,
  );

  const totalTipperScore = filteredTippers
    .map((tipper) => tipper.tipperScores[0]?.score ?? 0)
    .reduce((acc, score) => acc + score, 0);

  const leaderboardData = filteredTippers.map((tipper, i) => {
    const tipperScore = tipper.tipperScores[0]?.score ?? 0;

    const potentialTipperRewards = Math.max(
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
      potentialTipperRewards,
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
