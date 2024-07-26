import { QueueEvents, Worker } from "bullmq";
import dayjs from "dayjs";
import { chunk } from "underscore";
import { prisma } from "../../prisma";
import {
  logQueueEvents,
  queueConnection,
  queueNames,
  syncTipperDataQueue,
} from "../bullmq";
import { syncUserDataBatch } from "./syncUserData";

const BATCH_SIZE = 1000;

new Worker(queueNames.SYNC_TIPPERS, syncUserDataBatch, {
  connection: queueConnection,
  concurrency: 5,
});

let completedJobs = 0;
let totalJobs: number;

export async function syncTipperData() {
  console.info(`STARTING ${queueNames.SYNC_TIPPERS}`);

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
  const day = dayjs().format("YYYY-MM-DD");

  syncTipperDataQueue.addBulk(
    fidBatches.map((fids, i) => {
      const jobId = `syncTipperData-${day}-batch:${i * BATCH_SIZE + fids.length}`;
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

logQueueEvents({ queueEvents, queueName: queueNames.SYNC_TIPPERS });

queueEvents.on("completed", (job) => {
  completedJobs++;

  console.info(`${job.jobId} completed (${completedJobs}/${totalJobs}).`);

  if (completedJobs === totalJobs) {
    console.log(`${queueNames.SYNC_TIPPERS} all jobs completed!`);
    totalJobs = 0;
    completedJobs = 0;
  }
});
