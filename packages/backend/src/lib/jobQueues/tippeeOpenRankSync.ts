import {
  cronSchedules,
  dayUTC,
  getOpenRankScores,
  isProduction,
} from "@farther/common";
import * as Sentry from "@sentry/node";
import { Job, QueueEvents, Worker } from "bullmq";
import { chunk } from "underscore";
import { tippees as dummyTippees } from "../../dummy-data/tippees";
import { prisma } from "../../prisma";
import {
  getJobCounts,
  logQueueEvents,
  queueConnection,
  queueNames,
  tippeeOpenRankSyncQueue,
} from "../bullmq";
import { getLatestCronTime } from "../getLatestCronTime";

const BATCH_SIZE = 100;

new Worker(queueNames.TIPPEE_OPENRANK_SYNC, storeScores, {
  connection: queueConnection,
  concurrency: 3,
});

export async function tippeeOpenRankSync() {
  console.log(`STARTING: ${queueNames.TIPPEE_OPENRANK_SYNC}`);

  await tippeeOpenRankSyncQueue.obliterate();

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
    `${queueNames.TIPPEE_OPENRANK_SYNC} fids to process: ${tippeeFids.length}. Total jobs: ${fidChunks.length}`,
  );

  // Putting the hour in the job name to avoid collisions
  const date = dayUTC();
  const day = date.format("YYYY-MM-DD");
  const hour = date.hour();

  await tippeeOpenRankSyncQueue.addBulk(
    fidChunks.map((fids, i) => {
      const jobId = `${queueNames.TIPPEE_OPENRANK_SYNC}-${day}-h${hour}-batch:${i * BATCH_SIZE + fids.length}`;
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

  const scoresData = await getOpenRankScores({
    fids: tippeeFids,
    type: "ENGAGEMENT",
  });

  const snapshotTimeId = getLatestCronTime(cronSchedules.TIPPEE_OPENRANK_SYNC);

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
            jobQueue: queueNames.TIPPEE_OPENRANK_SYNC,
            snapshotTimeId,
            job: job.id,
            fid: scoreData.fid,
          },
        },
      });
    }
  }
}

const queueEvents = new QueueEvents(queueNames.TIPPEE_OPENRANK_SYNC, {
  connection: queueConnection,
});

logQueueEvents({ queueEvents, queueName: queueNames.TIPPEE_OPENRANK_SYNC });

queueEvents.on("completed", async (job) => {
  const { total, completed, failed } = await getJobCounts(
    tippeeOpenRankSyncQueue,
  );

  console.info(`done: ${job.jobId}. (${completed}/${total})`);

  if (total === completed + failed) {
    console.log(
      `ALL DONE: ${queueNames.TIPPEE_OPENRANK_SYNC}. Completed: ${completed}. Failed: ${failed}`,
    );
    await tippeeOpenRankSyncQueue.drain();
  }
});
