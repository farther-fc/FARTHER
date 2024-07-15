import { OPENRANK_SNAPSHOT_INTERVAL, TIP_SCORE_SCALER } from "@farther/common";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import { writeFile } from "fs";
import { prisma } from "../prisma";
import { getLatestTipperAirdrop } from "./getLatestTipperAirdrop";
import { getTippersByDate } from "./getTippersByDate";

const SCORE_START_DATE = new Date("2024-07-14T03:00:08.894Z");

export async function calculateTipperScores() {
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
    const tipperSCore = getTipperScore({
      tips: tipSnapshots[tipper.id] || [],
      latestTippeeOpenRankScores,
    });

    tipperScores[tipper.id] = tipperSCore.toNumber();
  }

  const sortedScores = Object.entries(tipperScores)
    .sort((a, b) => a[1] - b[1])
    .map(([fid, rawScore]) => ({ fid, rawScore }));

  const total = sortedScores.reduce(
    (acc, { rawScore }) => acc.add(rawScore),
    new Decimal(0),
  );

  console.log(sortedScores);
  console.log({ total });

  return sortedScores;
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
 * For each tip, this calculates the OpenRank score change of the recipient per token tipped,
 * then returns an average of those values.
 */
function getTipperScore({
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
  const scores = tips
    .reduce((acc, tip) => {
      const startScore = new Decimal(tip.startScore || 0);
      const latestScore = new Decimal(latestTippeeOpenRankScores[tip.tippeeId]);

      // Change in OpenRank score per day
      const daysSinceTip = dayjs().diff(tip.createdAt, "day", true);
      const openRankChange = latestScore.sub(startScore);
      const openRankChangePerDay = openRankChange.div(daysSinceTip);

      // Change per token
      const changePerToken = openRankChangePerDay.div(tip.amount);

      // if ([268455, 283056].includes(tip.tipperId)) {
      //   console.log(
      //     // "startScore",
      //     // startScore,
      //     // "latestScore",
      //     // latestScore,
      //     "fid",
      //     tip.tipperId,
      //     "hash",
      //     tip.hash,
      //     "days",
      //     daysSinceTip,
      //     "openrankChange",
      //     openRankChange.mul(TIP_SCORE_SCALER).toNumber().toLocaleString(),
      //   );
      // }

      return acc.add(changePerToken);
    }, new Decimal(0))
    // Scale up to human readable numbers
    .mul(TIP_SCORE_SCALER);

  return scores.div(tips.length);
}

calculateTipperScores().then((scores) => {
  // console.log(scores);
  writeFile("tipperScores.json", JSON.stringify(scores, null, 2), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Tipper scores written to tipperScores.json");
    }
  });
});
