import { QueueEvents, Worker } from "bullmq";
import { chunk } from "underscore";
import { prisma } from "../../prisma";
import {
  logQueueEvents,
  queueConnection,
  queueNames,
  syncTipperDataQueue,
} from "../bullmq";
import { dayUTC } from "../utils/dayUTC";
import { counter } from "./counter";
import { syncUserDataBatch } from "./syncUserData";

const BATCH_SIZE = 1000;

new Worker(queueNames.SYNC_TIPPERS, syncUserDataBatch, {
  connection: queueConnection,
  concurrency: 5,
});

export async function syncTipperData() {
  console.info(`STARTING: ${queueNames.SYNC_TIPPERS}`);

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

  await counter.init({
    queueName: queueNames.SYNC_TIPPERS,
    total: fidBatches.length,
  });

  // Putting the day in the job name to avoid collisions
  const day = dayUTC().format("YYYY-MM-DD");

  await syncTipperDataQueue.addBulk(
    fidBatches.map((fids, i) => {
      const jobId = `${queueNames.SYNC_TIPPERS}-${day}-batch:${i * BATCH_SIZE + fids.length}`;
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

queueEvents.on("completed", async (job) => {
  const { count, total } = await counter.increment(queueNames.SYNC_TIPPERS);

  console.info(`done: ${job.jobId} (${count}/${total}).`);

  if (count === total) {
    console.log(`ALL DONE: ${queueNames.SYNC_TIPPERS} all jobs completed!`);
    await syncTipperDataQueue.drain();
    await counter.remove(queueNames.SYNC_TIPPERS);
  }
});
