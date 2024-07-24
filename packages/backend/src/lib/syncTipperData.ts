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

  // Putting the day in the job name to avoid collisions
  const time = dayjs().format("YYYY-MM-DD");

  syncTipperDataQueue.addBulk(
    fidBatches.map((fids, i) => {
      const jobId = `syncTipperDataBatch-${time}-${i * BATCH_SIZE + fids.length}`;
      return {
        name: jobId,
        data: { fids },
        opts: { jobId, attempts: 5 },
      };
    }),
  );
}

const queueEvents = new QueueEvents(queueNames.SYNC_TIPPERS);

queueEvents.on("completed", (job) => {
  console.log(`Job ${job.jobId} completed.`);
});
