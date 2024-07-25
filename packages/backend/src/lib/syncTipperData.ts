import * as Sentry from "@sentry/node";
import { QueueEvents, Worker } from "bullmq";
import dayjs from "dayjs";
import { chunk } from "underscore";
import { prisma } from "../prisma";
import { queueConnection, queueNames, syncTipperDataQueue } from "./bullmq";
import { syncUserDataBatch } from "./syncUserData";

const BATCH_SIZE = 1000;

new Worker(queueNames.SYNC_TIPPERS, syncUserDataBatch, {
  connection: queueConnection,
  concurrency: 5,
});

let completedJobs = 0;
let totalJobs: number;

export async function syncTipperData() {
  await syncTipperDataQueue.drain();

  const tippers = await prisma.user.findMany({
    where: {
      tipsGiven: {
        some: {},
      },
    },
  });

  const allFids = tippers.map((user) => user.id);

  const fidBatches = chunk(allFids, BATCH_SIZE);

  console.log(
    `Syncing ${allFids.length} users in ${fidBatches.length} batches...`,
  );

  totalJobs = fidBatches.length;

  // Putting the day in the job name to avoid collisions
  const time = dayjs().format("YYYY-MM-DD");

  syncTipperDataQueue.addBulk(
    fidBatches.map((fids, i) => {
      const jobId = `syncTipperData-${time}-batch:${i * BATCH_SIZE + fids.length}`;
      return {
        name: jobId,
        data: { fids },
        opts: { jobId, attempts: 5 },
      };
    }),
  );
}

const queueEvents = new QueueEvents(queueNames.SYNC_TIPPERS, {
  connection: queueConnection,
});

queueEvents.on("active", (job) => {
  console.info(`${queueNames.SYNC_TIPPERS} active job: ${job.jobId}`);
});

queueEvents.on("stalled", async (job) => {
  console.error(`${queueNames.SYNC_TIPPERS} stalled job: ${job.jobId}`);
});

queueEvents.on("failed", async (job) => {
  const message = `${queueNames.SYNC_TIPPERS} failed job: ${job.jobId}. Reason: ${job.failedReason}`;
  console.error(message);
  Sentry.captureException(message);
});

queueEvents.on("error", async (error) => {
  console.error(`${queueNames.SYNC_TIPPERS}, error: ${error}`);
  Sentry.captureException(error, {
    captureContext: {
      tags: {
        jobQueue: queueNames.SYNC_TIPPERS,
      },
    },
  });
});

queueEvents.on("completed", (job) => {
  completedJobs++;

  console.info(
    `${queueNames.SYNC_TIPPERS} job ${job.jobId} completed (${completedJobs}/${totalJobs}).`,
  );

  if (completedJobs === totalJobs) {
    console.log(`${queueNames.SYNC_TIPPERS} all jobs completed!`);
    totalJobs = 0;
    completedJobs = 0;
  }
});
