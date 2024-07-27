import {
  cronSchedules,
  isProduction,
  retryWithExponentialBackoff,
} from "@farther/common";
import { getOpenRankScores } from "@farther/common/src/getOpenRankScore";
import * as Sentry from "@sentry/node";
import { Job, QueueEvents, Worker } from "bullmq";
import { chunk } from "underscore";
import { tippees as dummyTippees } from "../../dummy-data/tippees";
import { prisma } from "../../prisma";
import {
  logQueueEvents,
  openRankSnapshotQueue,
  queueConnection,
  queueNames,
} from "../bullmq";
import { getLatestCronTime } from "../getLatestCronTime";
import { dayUTC } from "../utils/dayUTC";

const BATCH_SIZE = 100;

let completedJobs = 0;
let totalJobs: number;

new Worker(queueNames.OPENRANK_SNAPSHOT, storeScores, {
  connection: queueConnection,
  concurrency: 3,
});

export async function openRankSnapshot() {
  console.log(`STARTING: ${queueNames.OPENRANK_SNAPSHOT}`);

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

  console.log(
    `${queueNames.OPENRANK_SNAPSHOT} total to process: ${tippeeFids.length}`,
  );

  const fidChunks = chunk(tippeeFids, BATCH_SIZE);

  totalJobs = fidChunks.length;

  // Putting the hour in the job name to avoid collisions
  const date = dayUTC();
  const day = date.format("YYYY-MM-DD");
  const hour = date.format("hh");

  openRankSnapshotQueue.addBulk(
    fidChunks.map((fids, i) => {
      const jobId = `${queueNames.OPENRANK_SNAPSHOT}-${day}-h${hour}-batch:${i * BATCH_SIZE + fids.length}`;
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

  const scores = await getOpenRankScores(tippeeFids);

  const snapshotTimeId = getLatestCronTime(cronSchedules.OPENRANK_SNAPSHOT);

  await retryWithExponentialBackoff(async () => {
    try {
      return await prisma.$transaction(
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
    } catch (error) {
      Sentry.captureException(error.message, {
        contexts: {
          tags: {
            jobQueue: queueNames.OPENRANK_SNAPSHOT,
            tippeeFids: tippeeFids.join(","),
          },
        },
      });
      throw error;
    }
  });
}

const queueEvents = new QueueEvents(queueNames.OPENRANK_SNAPSHOT, {
  connection: queueConnection,
});

logQueueEvents({ queueEvents, queueName: queueNames.OPENRANK_SNAPSHOT });

queueEvents.on("completed", (job) => {
  completedJobs++;

  console.info(`done: ${job.jobId} (${completedJobs}/${totalJobs}).`);
  if (completedJobs === totalJobs) {
    console.log(
      `ALL DONE: ${queueNames.OPENRANK_SNAPSHOT} All jobs completed!`,
    );
    totalJobs = 0;
    completedJobs = 0;
  }
});
