import { cronSchedules, isProduction } from "@farther/common";
import { getOpenRankScores } from "@farther/common/src/getOpenRankScore";
import * as Sentry from "@sentry/node";
import { Job, QueueEvents, Worker } from "bullmq";
import Decimal from "decimal.js";
import { chunk } from "underscore";
import { tippees as dummyTippees } from "../../dummy-data/tippees";
import { prisma } from "../../prisma";
import {
  getJobCounts,
  logQueueEvents,
  openRankSnapshotQueue,
  queueConnection,
  queueNames,
} from "../bullmq";
import { getLatestCronTime } from "../getLatestCronTime";
import { dayUTC } from "../utils/dayUTC";

const BATCH_SIZE = 100;

new Worker(queueNames.OPENRANK_SNAPSHOT, storeScores, {
  connection: queueConnection,
  concurrency: 3,
});

export async function openRankSnapshot() {
  console.log(`STARTING: ${queueNames.OPENRANK_SNAPSHOT}`);

  await openRankSnapshotQueue.obliterate();

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

  const tippeeFids = Array.from(new Set(tippees.map((t) => t.id)));

  const fidChunks = chunk(tippeeFids, BATCH_SIZE);

  console.log(
    `${queueNames.OPENRANK_SNAPSHOT} fids to process: ${tippeeFids.length}. Total jobs: ${fidChunks.length}`,
  );

  // Putting the hour in the job name to avoid collisions
  const date = dayUTC();
  const day = date.format("YYYY-MM-DD");
  const hour = date.hour();

  await openRankSnapshotQueue.addBulk(
    fidChunks.map((fids, i) => {
      const jobId = `${queueNames.OPENRANK_SNAPSHOT}-${day}-h${hour}-batch:${i * BATCH_SIZE + fids.length}`;
      console.log(`Adding job: ${jobId}`);
      return {
        name: jobId,
        data: { fids },
        opts: { jobId, attempts: 5 },
      };
    }),
  );
}

async function storeScores(job: Job) {
  const tippeeFids = job.data.fids as number[];

  const scoresData = await getOpenRankScores(tippeeFids);

  const snapshotTimeId = getLatestCronTime(cronSchedules.OPENRANK_SNAPSHOT);

  for (const scoreData of scoresData) {
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
            id: scoreData.fid,
          },
          create: {
            id: scoreData.fid,
          },
        },
      },
      score: scoreData.score,
      scoreNew: new Decimal(scoreData.score),
    } as const;

    try {
      await prisma.openRankScore.upsert({
        where: {
          userId_snapshotId: {
            snapshotId: snapshotTimeId,
            userId: scoreData.fid,
          },
        },
        create: data,
        update: data,
      });
    } catch (error) {
      Sentry.captureException(error.message, {
        contexts: {
          tags: {
            jobQueue: queueNames.OPENRANK_SNAPSHOT,
            snapshotTimeId,
            fid: scoreData.fid,
          },
        },
      });
    }
  }
}

const queueEvents = new QueueEvents(queueNames.OPENRANK_SNAPSHOT, {
  connection: queueConnection,
});

logQueueEvents({ queueEvents, queueName: queueNames.OPENRANK_SNAPSHOT });

queueEvents.on("completed", async (job) => {
  const { total, completed, failed } = await getJobCounts(
    openRankSnapshotQueue,
  );

  console.info(`done: ${job.jobId}. (${completed}/${total})`);

  if (total === completed + failed) {
    console.log(
      `ALL DONE: ${queueNames.OPENRANK_SNAPSHOT}. Completed: ${completed}. Failed: ${failed}`,
    );
    await openRankSnapshotQueue.drain();
  }
});
