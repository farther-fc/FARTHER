import { OPENRANK_SNAPSHOT_INTERVAL, TIP_SCORE_SCALER } from "@farther/common";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import { prisma } from "../prisma";
import { getLatestTipperAirdrop } from "./getLatestTipperAirdrop";
import { getTippersByDate } from "./getTippersByDate";
import { dbScheduler } from "./helpers";

const SCORE_START_DATE = new Date("2024-07-14T03:00:08.894Z");

export async function updateTipperScores() {
  console.log(`Starting calculateTipperScores`, new Date());

  const latestAirdrop = await getLatestTipperAirdrop();
  const tippers = await getTippersByDate({
    from: latestAirdrop ? latestAirdrop.createdAt : SCORE_START_DATE,
    // Recent tips won't have an OpenRank score change yet
    to: dayjs().subtract(OPENRANK_SNAPSHOT_INTERVAL, "hours").toDate(),
  });

  const tips = tippers.map((tipper) => tipper.tipsGiven).flat();
  const tipees = new Set(tips.map((tip) => tip.tippeeId));

  // Tips grouped by tipper
  const tipSnapshots: {
    [tipperId: number]: {
      hash: string;
      tipperId: number;
      tippeeId: number;
      createdAt: Date;
      amount: number;
      startScore: number | null;
    }[];
  } = {};

  tips.forEach((tip) => {
    if (!tipSnapshots[tip.tipperId]) {
      tipSnapshots[tip.tipperId] = [];
    }
    if (tip.tippeeOpenRankScore === null) {
      throw new Error(
        `Tipper ${tip.tipperId} has a tip with no tippeeOpenRankScore`,
      );
    }
    tipSnapshots[tip.tipperId].push({
      hash: tip.hash,
      tipperId: tip.tipperId,
      tippeeId: tip.tippeeId,
      createdAt: tip.createdAt,
      amount: tip.amount,
      startScore: tip.tippeeOpenRankScore,
    });
  });

  const latestTippeeOpenRankScores = await getLatestOpenRankScores(
    Array.from(tipees),
  );

  const tipperScores: { [fid: number]: number } = {};

  for (const tipper of tippers) {
    const tipScores = await getTipScores({
      tips: tipSnapshots[tipper.id] || [],
      latestTippeeOpenRankScores,
    });

    const totalScore = tipScores.reduce(
      (acc, score) => acc.add(score.changePerToken),
      new Decimal(0),
    );

    const tipUpdates = tipScores.map((tip, index) =>
      dbScheduler.schedule(() =>
        prisma.tip.update({
          where: { hash: tip.hash },
          data: {
            openRankChange: tipScores[index].changePerToken.toNumber(),
          },
        }),
      ),
    );

    await Promise.all(tipUpdates);

    // Return average
    const tipperScore = totalScore.div(tips.length);

    tipperScores[tipper.id] = tipperScore.toNumber();
  }

  const sortedScores = Object.entries(tipperScores)
    .sort((a, b) => a[1] - b[1])
    .map(([fid, score]) => ({ fid, score }));

  await prisma.tipScore.createMany({
    data: sortedScores.map(({ fid, score }) => ({
      userId: parseInt(fid),
      score,
    })),
  });
}

async function getLatestOpenRankScores(fids: number[]) {
  const data = await prisma.user.findMany({
    where: {
      id: {
        in: fids,
      },
    },
    select: {
      id: true,
      openRankScores: {
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

  const scores: { [fid: number]: number } = {};

  data.forEach((user) => {
    scores[user.id] = user.openRankScores[0] ? user.openRankScores[0].score : 0;
  });

  return scores;
}

/**
 * For each tip, this calculates the OpenRank score change of the recipient per token tipped
 */
async function getTipScores({
  tips,
  latestTippeeOpenRankScores,
}: {
  tips: {
    hash: string;
    tipperId: number;
    tippeeId: number;
    createdAt: Date;
    amount: number;
    startScore: number | null;
  }[];
  latestTippeeOpenRankScores: { [fid: number]: number };
}) {
  return tips.map((tip) => {
    const startScore = new Decimal(tip.startScore || 0);
    const latestScore = new Decimal(latestTippeeOpenRankScores[tip.tippeeId]);

    // Change in OpenRank score per day
    const daysSinceTip = dayjs().diff(tip.createdAt, "day", true);
    const openRankChange = latestScore.div(startScore).mul(100).sub(100);
    const openRankChangePerDay = openRankChange.div(daysSinceTip);

    // Change per token
    const changePerToken = openRankChangePerDay.div(tip.amount);

    // Scale up to human readable numbers
    return {
      hash: tip.hash,
      changePerToken: changePerToken.mul(TIP_SCORE_SCALER),
    };
  });
}

// calculateTipperScores().then((scores) => {
//   // console.log(scores);
//   writeFile("tipperScores.json", JSON.stringify(scores, null, 2), (err) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log("Tipper scores written to tipperScores.json");
//     }
//   });
// });
