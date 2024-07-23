import { Worker } from "bullmq";
import { chunk } from "underscore";
import { disconnectCron } from "../crons";
import { prisma } from "../prisma";
import { queueConnection, queueNames, syncTipperDataQueue } from "./bullmq";
import { syncUserDataBatch } from "./syncUserData";

const BATCH_SIZE = 1000;

const worker = new Worker(queueNames.SYNC_TIPPERS, syncUserDataBatch, {
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

  syncTipperDataQueue.addBulk(
    fidBatches.map((fids, i) => {
      const jobId = `syncTipperDataBatch-${i * BATCH_SIZE + fids.length}`;
      return {
        name: jobId,
        data: { fids },
        opts: { jobId },
      };
    }),
  );
}

worker.on("completed", (_, { jobName }) => {
  console.log(`Job ${jobName} completed.`);
  disconnectCron();
});
