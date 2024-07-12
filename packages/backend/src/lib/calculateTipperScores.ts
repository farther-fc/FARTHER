import dayjs from "dayjs";
import Decimal from "decimal.js";
import { writeFile } from "fs";
import { prisma } from "../prisma";
import { getLatestTipperAirdrop } from "./getLatestTipperAirdrop";
import { acceptedLookBackDate } from "./getOpenRankScorePair";
import { getRecentTippers } from "./getRecentTippers";

const SCORE_START_DATE = new Date("2024-07-09T15:00:00.000Z");

export async function calculateTipperScores() {
  console.log(`Starting calculateTipperScores`, new Date());

  const latestAirdrop = await getLatestTipperAirdrop();
  const tippers = await getRecentTippers(
    latestAirdrop ? latestAirdrop.createdAt : SCORE_START_DATE,
  );

  const tips = tippers.map((tipper) => tipper.tipsGiven).flat();
  const tipees = new Set(tips.map((tip) => tip.tippeeId));

  // Tip data for each tipeee to calculate the tipper's score
  const tippeeTipSnapshots: {
    [fid: number]: {
      tippeeId: number;
      createdAt: Date;
      amount: number;
      startScore: number | null;
    }[];
  } = {};

  tips.forEach((tip) => {
    if (!tippeeTipSnapshots[tip.tippeeId]) {
      tippeeTipSnapshots[tip.tippeeId] = [];
    }
    tippeeTipSnapshots[tip.tippeeId].push({
      tippeeId: tip.tippeeId,
      createdAt: tip.createdAt,
      amount: tip.amount,
      startScore: tip.tippeeOpenRankScore,
    });
  });

  const latestTippeeOpenRankScores = await getUserOpenRankScores(
    Array.from(tipees),
  );

  return Object.entries(tippeeTipSnapshots).map(([fid, tips]) => {
    const latestOpenRankScoreData = latestTippeeOpenRankScores.find(
      (d) => d.fid === Number(fid),
    );

    const tipScoreSum = getTipScoreSum({
      tips,
      latestOpenRankScore: latestOpenRankScoreData
        ? latestOpenRankScoreData.openRankScore
        : 0,
    });

    const totalAmountTipped = tips.reduce((acc, tip) => acc + tip.amount, 0);
    return {
      fid,
      tipperScore: tipScoreSum.toNumber() / totalAmountTipped,
    };
  });
}

async function getUserOpenRankScores(fids: number[]) {
  const data = await prisma.user.findMany({
    where: {
      id: {
        in: fids,
      },
    },
    select: {
      id: true,
      openRankScores: {
        where: {
          createdAt: {
            gte: acceptedLookBackDate,
          },
        },
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

  return data.map((user) => ({
    fid: user.id,
    openRankScore: user.openRankScores[0].score,
  }));
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
  writeFile("tipperScores.json", JSON.stringify(scores), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Tipper scores written to tipperScores.json");
    }
  });
});
