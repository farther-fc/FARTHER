import {
  TIP_MINIMUM,
  dayUTC,
  detectNefariousClusters,
  getOpenRankScores,
  getStartOfMonthUTC,
} from "@farther/common";
import { writeFile } from "fs/promises";
import { prisma } from "../prisma";

async function findNefariousClusters() {
  const now = dayUTC();

  const rawTips = await prisma.tip.findMany({
    where: {
      AND: [
        {
          invalidTipReason: null,
          createdAt: {
            gte: getStartOfMonthUTC(0),
          },
        },
      ],
    },
  });

  const tips = rawTips.map((tip) => ({
    tipperId: tip.tipperId,
    tippeeId: tip.tippeeId,
  }));

  const nefariousClusters = detectNefariousClusters({
    tips,
    minTips: 3,
    clusteringThreshold: 0.3,
    diversityThreshold: 0.5,
  });

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: nefariousClusters.flat().map((c) => c.id),
      },
    },
    include: {
      tipsGiven: {
        where: {
          invalidTipReason: null,
          createdAt: {
            gte: getStartOfMonthUTC(0),
          },
        },
      },
    },
  });

  const fids = users.map((u) => u.id);

  const openRankStats = await getOpenRankScores({ fids, type: "FOLLOWING" });

  writeFile(
    "nefariousClusters.json",
    JSON.stringify(
      nefariousClusters.map((c) =>
        c
          .map((c) => {
            const user = users.find((u) => u.id === c.id);
            if (!user) {
              throw new Error(`User not found for id ${c.id}`);
            }
            const uniqueRecipients = new Set(
              user?.tipsGiven.map((t) => t.tippeeId),
            ).size;
            return {
              ...c,
              username: user?.username,
              tipsGiven: user?.tipsGiven.length,
              openRank: openRankStats.find((o) => o.fid === c.id)?.rank,
              uniqueRecipients,
              uniqueRecipientsPerTip: uniqueRecipients / user.tipsGiven.length,
            };
          })
          .sort((a, b) => b.uniqueRecipientsPerTip - a.uniqueRecipientsPerTip),
      ),
      null,
      2,
    ),
  );

  const secondsTaken = dayUTC().diff(now, "seconds");

  console.log(`Finished in ${secondsTaken} seconds`);
}

async function uniqueToTotalRatio() {
  const rawTipperData = await prisma.user.findMany({
    where: {
      tipsGiven: {
        some: {
          invalidTipReason: null,
          createdAt: {
            gte: getStartOfMonthUTC(0),
          },
        },
      },
    },
    include: {
      tipsGiven: {
        where: {
          invalidTipReason: null,
          createdAt: {
            gte: getStartOfMonthUTC(0),
          },
        },
      },
    },
  });

  const tippers = rawTipperData
    .filter((tipper) => tipper.tipsGiven.length > 10)
    .map((tipper) => {
      const uniqueRecipients = new Set(
        tipper.tipsGiven.map((tip) => tip.tippeeId),
      ).size;
      const totalAmount = tipper.tipsGiven.reduce(
        (acc, tip) => acc + tip.amount,
        0,
      );

      const maxBreadthTipAmount = totalAmount / TIP_MINIMUM;
      const avgTipPerUniqueRecipient = totalAmount / uniqueRecipients;

      const breadthScore =
        (maxBreadthTipAmount / avgTipPerUniqueRecipient +
          uniqueRecipients / tipper.tipsGiven.length) /
        2;

      return {
        id: tipper.id,
        username: tipper.username,
        uniqueRecipients,
        totalTips: tipper.tipsGiven.length,
        totalAmount: tipper.tipsGiven.reduce((acc, tip) => acc + tip.amount, 0),
        breadthScore,
      };
    })
    .sort((a, b) => b.breadthScore - a.breadthScore);

  await writeFile("uniqueToTotalRatio.json", JSON.stringify(tippers, null, 2));
}

uniqueToTotalRatio();

// findNefariousClusters();
