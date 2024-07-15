import { OpenRankError, cronSchedules, isProduction } from "@farther/common";
import {
  OpenRankData,
  getOpenRankScores,
} from "@farther/common/src/getOpenRankScore";
import * as Sentry from "@sentry/node";
import { tippees as dummyTippees } from "../dummy-data/tippees";
import { prisma } from "../prisma";
import { getLatestCronTime } from "./getLatestCronTime";

export async function takeOpenRankSnapshot() {
  console.log("Running takeOpenRankSnapshot", new Date());

  const tippees = !isProduction
    ? dummyTippees
    : await prisma.user.findMany({
        where: {
          tipsReceived: {
            some: {
              invalidTipReason: null,
            },
          },
        },
        select: {
          id: true,
        },
      });

  const tipeeeFids = tippees.map((t) => t.id);

  try {
    const scores = await getOpenRankScores(tipeeeFids);

    await storeScores(scores);
  } catch (error) {
    console.error(error);
    Sentry.captureException(new OpenRankError({ message: error.message }));
  }
}

async function storeScores(scores: OpenRankData["result"]) {
  const snapshotTimeId = getLatestCronTime(cronSchedules.OPENRANK_SNAPSHOT);

  await prisma.$transaction(
    scores.map((r) => {
      const data = {
        snapshot: {
          connectOrCreate: {
            where: {
              id: snapshotTimeId,
            },
            create: {
              id: snapshotTimeId,
            },
          },
        },
        user: {
          connectOrCreate: {
            where: {
              id: r.fid,
            },
            create: {
              id: r.fid,
            },
          },
        },
        score: r.score,
      } as const;

      return prisma.openRankScore.upsert({
        where: {
          userId_snapshotId: {
            snapshotId: snapshotTimeId,
            userId: r.fid,
          },
        },
        create: data,
        update: data,
      });
    }),
  );
}
