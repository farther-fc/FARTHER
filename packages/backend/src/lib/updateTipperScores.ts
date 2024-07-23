import { OPENRANK_SNAPSHOT_INTERVAL, cacheTypes } from "@farther/common";
import * as Sentry from "@sentry/node";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import { prisma } from "../prisma";
import { getLatestOpenRankScores } from "./getLatestOpenRankScores";
import { getLatestTipperAirdrop } from "./getLatestTipperAirdrop";
import { getTipScores } from "./getTipScores";
import { getTippersByDate } from "./getTippersByDate";
import { flushCache } from "./utils/flushCache";
import { dbScheduler } from "./utils/helpers";

const SCORE_START_DATE = new Date("2024-07-14T03:00:08.894Z");

export async function updateTipperScores() {
  console.log(`Starting updateTipperScores`, new Date());

  try {
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
        startScore: number;
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

    const endScores = await getLatestOpenRankScores(Array.from(tipees));

    const tipperScores: { [fid: number]: number } = {};

    for (const tipper of tippers) {
      const tipScores = await getTipScores({
        tips: tipSnapshots[tipper.id] || [],
        endScores,
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

    await prisma.tipperScore.createMany({
      data: sortedScores.map(({ fid, score }) => ({
        userId: parseInt(fid),
        score,
      })),
    });

    await flushCache({
      type: cacheTypes.USER,
      ids: sortedScores.map(({ fid }) => parseInt(fid)),
    });
  } catch (error) {
    Sentry.captureException(error, {
      captureContext: {
        tags: {
          method: "updateTipperScores",
        },
      },
    });
  }

  console.log(`Finished updateTipperScores`, new Date());
}
