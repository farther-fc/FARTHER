import { TIPPER_REWARDS_POOL, getStartOfMonthUTC } from "@farther/common";
import { prisma } from "../prisma";

const currentPrice = 0.0025;

async function preppotentialTipperRewards() {
  const tippers = await prisma.user.findMany({
    where: {
      AND: [
        {
          tipsGiven: {
            some: {
              createdAt: {
                gte: getStartOfMonthUTC(0),
              },
            },
          },
        },
        {
          tipperScores: {
            some: {
              score: {
                gt: 0,
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      tipperScores: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          score: true,
        },
      },
    },
  });

  const totalScore = tippers.reduce((acc, tipper) => {
    return acc + tipper.tipperScores[0].score;
  }, 0);

  const rewards = tippers.map((tipper) => {
    const score = tipper.tipperScores[0].score;
    const weight = score / totalScore;
    return {
      userId: tipper.id,
      score: score,
      reward: `$${(weight * TIPPER_REWARDS_POOL * currentPrice).toLocaleString()}`,
    };
  });

  console.log(rewards.sort((a, b) => b.score - a.score));

  const medianReward = rewards[Math.floor(rewards.length / 2)].reward;

  console.log(
    `averageReward: ${(TIPPER_REWARDS_POOL * currentPrice) / rewards.length}`,
  );
  console.log(`medianReward: ${medianReward}`);
}

preppotentialTipperRewards();
