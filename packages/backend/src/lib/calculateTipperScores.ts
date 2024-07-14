import dayjs from "dayjs";
import Decimal from "decimal.js";
import { writeFile } from "fs";
import { prisma } from "../prisma";
import { getLatestTipperAirdrop } from "./getLatestTipperAirdrop";
import { getRecentTippers } from "./getRecentTippers";

// // Allow for a 1 hour buffer in case the snapshot is delayed
//  const acceptedWindowMs =
//   (OPENRANK_SNAPSHOT_INTERVAL + 1) * 60 * 60 * 1000;

const SCORE_START_DATE = new Date(1720747891576);

export async function calculateTipperScores() {
  console.log(`Starting calculateTipperScores`, new Date());

  const latestAirdrop = await getLatestTipperAirdrop();
  const tippers = await getRecentTippers(
    latestAirdrop ? latestAirdrop.createdAt : SCORE_START_DATE,
  );

  const tips = tippers.map((tipper) => tipper.tipsGiven).flat();
  const tipees = new Set(tips.map((tip) => tip.tippeeId));

  // Grouped by tipper
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
      latestOpenRankScore: latestTippeeOpenRankScores[tipper.id] || 0,
    });

    const totalAmountTipped = tips.reduce((acc, tip) => acc + tip.amount, 0);

    tipperScores[tipper.id] = tipScoreSum.toNumber() / totalAmountTipped;
  }
  return tipperScores;
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
  latestOpenRankScore,
}: {
  tips: {
    tippeeId: number;
    createdAt: Date;
    amount: number;
    startScore: number | null;
  }[];
  latestOpenRankScore: number;
}) {
  return tips.reduce((acc, tip) => {
    const startScore = new Decimal(tip.startScore || 0);
    const latestScore = new Decimal(latestOpenRankScore);
    // % change in OpenRank score per day
    const daysSinceTip = dayjs().diff(tip.createdAt, "day", true);
    const openRankChange = latestScore.div(startScore);
    const openRankChangePerDay = openRankChange.div(daysSinceTip);

    return acc.add(openRankChangePerDay);
  }, new Decimal(0));
}

calculateTipperScores().then((scores) => {
  console.log(scores);
  writeFile("tipperScores.json", JSON.stringify(scores, null, 2), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Tipper scores written to tipperScores.json");
    }
  });
});
