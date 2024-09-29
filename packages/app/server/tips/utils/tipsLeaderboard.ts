import { prisma } from "@farther/backend";
import {
  ENVIRONMENT,
  TIPPER_REWARDS_POOL,
  getBreadthRatio,
} from "@farther/common";
import { dummyLeaderBoard } from "@lib/__tests__/testData";
import { getTippersForLeaderboard } from "server/tips/utils/getTippersForLeaderboard";

export async function tipsLeaderboard() {
  const leaderboardData = await getLeaderboardData();

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

  const totalTipperScore = tippers.reduce((acc, data) => {
    const score =
      data.user.tipperScores[0].score > 0 ? data.user.tipperScores[0].score : 0;
    return acc + score;
  }, 0);

  const leaderboardData = tippers.map((tipper, i) => {
    const user = tipper.user;

    const tipperScore = user.tipperScores[0]?.score ?? 0;

    const potentialTipperRewards = Math.max(
      0,
      (tipperScore / totalTipperScore) * TIPPER_REWARDS_POOL,
    );

    const seasonGivenCount = user.tipsGiven.length;
    const seasonGivenAmount = user.tipsGiven.reduce(
      (acc, t) => acc + t.amount,
      0,
    );

    const breadthRatio = getBreadthRatio(
      user.tipsGiven.map(({ tippeeId, amount }) => ({ tippeeId, amount })),
    );

    return {
      fid: user.id,
      displayName: user.displayName,
      pfpUrl: user.pfpUrl,
      username: user.username,
      powerBadge: user.powerBadge,
      tipperScore,
      orFollowingRank: tipper.orFollowingRank,
      breadthRatio,
      potentialTipperRewards,
      currentAllowance:
        user.tipAllowances[0].tipMetaId === currentTipMeta.id
          ? user.tipAllowances[0].amount
          : 0,
      totalAllowance: Math.round(
        user.tipAllowances.reduce(
          (acc, allowance) => acc + allowance.amount,
          0,
        ),
      ),
      seasonGivenCount,
      seasonGivenAmount,
      totalGivenCount: user.tipAllowances.reduce(
        (acc, ta) => acc + ta.tips.length,
        0,
      ),
      totalGivenAmount: Math.round(
        user.tipAllowances.reduce(
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
