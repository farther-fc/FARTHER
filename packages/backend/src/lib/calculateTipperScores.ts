import { TIP_SCORE_SCALER } from "@farther/common";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import { prisma } from "../prisma";
import { getLatestTipperAirdrop } from "./getLatestTipperAirdrop";
import { getRecentTippers } from "./getRecentTippers";

const SCORE_START_DATE = new Date("2024-07-14T03:00:08.894Z");

export async function calculateTipperScores() {
  console.log(`Starting calculateTipperScores`, new Date());

  const latestAirdrop = await getLatestTipperAirdrop();
  const tippers = await getRecentTippers(
    latestAirdrop ? latestAirdrop.createdAt : SCORE_START_DATE,
  );

  const tips = tippers.map((tipper) => tipper.tipsGiven).flat();
  const tipees = new Set(tips.map((tip) => tip.tippeeId));

  // Tips grouped by tipper
  const tipSnapshots: {
    [tipperId: number]: {
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
    tipSnapshots[tip.tipperId].push({
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
    const tipScoreSum = getTipScoreSum({
      tips: tipSnapshots[tipper.id] || [],
      latestTippeeOpenRankScores,
    });

    tipperScores[tipper.id] = tipScoreSum.toNumber();
  }
  return Object.entries(tipperScores).sort((a, b) => b[1] - a[1]);
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

function getTipScoreSum({
  tips,
  latestTippeeOpenRankScores,
}: {
  tips: {
    tippeeId: number;
    createdAt: Date;
    amount: number;
    startScore: number | null;
  }[];
  latestTippeeOpenRankScores: { [fid: number]: number };
}) {
  return (
    tips
      .reduce((acc, tip) => {
        const startScore = new Decimal(tip.startScore || 0);
        const latestScore = new Decimal(
          latestTippeeOpenRankScores[tip.tippeeId],
        );

        // Change in OpenRank score per day
        const daysSinceTip = dayjs().diff(tip.createdAt, "day", true);
        const openRankChange = latestScore.sub(startScore);
        const openRankChangePerDay = openRankChange.div(daysSinceTip);

        // Change per token
        const changePerToken = openRankChangePerDay.div(tip.amount);

        return acc.add(changePerToken);
      }, new Decimal(0))
      // Scale up to human readable numbers
      .mul(TIP_SCORE_SCALER)
  );
}

// calculateTipperScores().then((scores) => {
//   console.log(scores);
//   writeFile("tipperScores.json", JSON.stringify(scores, null, 2), (err) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log("Tipper scores written to tipperScores.json");
//     }
//   });
// });
