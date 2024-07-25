import {
  cronSchedules,
  isProduction,
  retryWithExponentialBackoff,
} from "@farther/common";
import { getOpenRankScores } from "@farther/common/src/getOpenRankScore";
import * as Sentry from "@sentry/node";
import { Job, QueueEvents, Worker } from "bullmq";
import dayjs from "dayjs";
import { chunk } from "underscore";
import { tippees as dummyTippees } from "../dummy-data/tippees";
import { prisma } from "../prisma";
import { openRankSnapshotQueue, queueConnection, queueNames } from "./bullmq";
import { getLatestCronTime } from "./getLatestCronTime";

const BATCH_SIZE = 100;

let completedJobs = 0;
let totalJobs: number;

new Worker(queueNames.OPENRANK_SNAPSHOT, storeScores, {
  connection: queueConnection,
  concurrency: 3,
});

export async function openRankSnapshot() {
  console.log("Starting openRankSnapshot", new Date());

  // await openRankSnapshotQueue.drain();

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

  totalJobs = fidChunks.length;

  // Putting the hour in the job name to avoid collisions
  const time = dayjs().format("YYYY-MM-DD-hh");

  openRankSnapshotQueue.addBulk(
    fidChunks.map((fids, i) => {
      const jobId = `openRankSnapshot-${time}-batch:${i * BATCH_SIZE + fids.length}`;
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

  console.info(`Starting job ${job.id} with ${tippeeFids.length} tippees`);

  const scores = await getOpenRankScores(tippeeFids);

  const snapshotTimeId = getLatestCronTime(cronSchedules.OPENRANK_SNAPSHOT);

  await retryWithExponentialBackoff(
    async () =>
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
      ),
  );
}

const queueEvents = new QueueEvents(queueNames.OPENRANK_SNAPSHOT, {
  connection: queueConnection,
});

queueEvents.on("active", (job) => {
  console.info(`${queueNames.OPENRANK_SNAPSHOT} active job: ${job.jobId}`);
});

queueEvents.on("stalled", async (job) => {
  console.error(`${queueNames.OPENRANK_SNAPSHOT} stalled job: ${job.jobId}`);
});

queueEvents.on("failed", async (job) => {
  const message = `${queueNames.OPENRANK_SNAPSHOT} failed job: ${job.jobId}. Reason: ${job.failedReason}`;
  console.error(message);
  Sentry.captureException(message);
});

queueEvents.on("error", (error) => {
  console.error(`${queueNames.OPENRANK_SNAPSHOT} error: ${error}`);
  Sentry.captureException(error, {
    captureContext: {
      tags: {
        jobQueue: queueNames.OPENRANK_SNAPSHOT,
      },
    },
  });
});

queueEvents.on("completed", (job) => {
  completedJobs++;

  console.info(
    `${queueNames.OPENRANK_SNAPSHOT} job ${job.jobId} completed (${completedJobs}/${totalJobs}).`,
  );
  if (completedJobs === totalJobs) {
    console.log(`${queueNames.OPENRANK_SNAPSHOT} All jobs completed!`);
  }
});
