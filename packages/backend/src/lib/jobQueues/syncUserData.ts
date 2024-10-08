import { dayUTC, neynar, retryWithExponentialBackoff } from "@farther/common";
import * as Sentry from "@sentry/node";
import Bottleneck from "bottleneck";
import { QueueEvents, Worker } from "bullmq";
import { chunk } from "underscore";
import { prisma } from "../../prisma";
import {
  getJobCounts,
  logQueueEvents,
  queueConnection,
  queueNames,
  syncUserDataQueue,
} from "../bullmq";
import { flushCache } from "../utils/flushCache";

const BATCH_SIZE = 1000;

const scheduler = new Bottleneck({
  maxConcurrent: 8,
  minTime: 20,
});

new Worker(queueNames.SYNC_USERS, syncUserDataBatch, {
  connection: queueConnection,
  concurrency: 5,
});

export async function syncUserDataBatch({
  name: jobName,
  data: { fids },
}: {
  name: string;
  data: { fids: number[] };
}) {
  try {
    const neynarUserData = await neynar.getUsersByFid(fids);

    if (neynarUserData.length !== fids.length) {
      throw new Error("Neynar data length does not match user data length");
    }

    const transactions = neynarUserData.map((data) =>
      scheduler.schedule(() =>
        retryWithExponentialBackoff(
          async () =>
            await prisma.$transaction(
              async (tx) => {
                await tx.userEthAccount.deleteMany({
                  where: {
                    userId: data.fid,
                  },
                });

                const profileData = {
                  pfpUrl: data.pfp_url,
                  username: data.username,
                  displayName: data.display_name,
                  followerCount: data.follower_count,
                  powerBadge: data.power_badge,
                  ethAccounts: {
                    connectOrCreate: data.verified_addresses.eth_addresses.map(
                      (address) => ({
                        where: {
                          userId_ethAccountId: {
                            userId: data.fid,
                            ethAccountId: address.toLowerCase(),
                          },
                        },
                        create: {
                          ethAccount: {
                            connectOrCreate: {
                              where: { address: address.toLowerCase() },
                              create: { address: address.toLowerCase() },
                            },
                          },
                        },
                      }),
                    ),
                  },
                } as const;
                await tx.user.upsert({
                  where: { id: data.fid },
                  update: profileData,
                  create: {
                    id: data.fid,
                    ...profileData,
                  },
                });
              },
              { timeout: 300_000 },
            ),
          { retries: 10 },
        ),
      ),
    );

    await Promise.all(transactions);

    // Delete orphaned eth accounts
    await prisma.ethAccount.deleteMany({
      where: {
        users: {
          none: {},
        },
      },
    });

    await flushCache({ type: "USER", ids: fids });

    return { jobName };
  } catch (error) {
    console.error("Error syncing user data", error);
    Sentry.captureException(error, {
      captureContext: {
        tags: {
          method: "syncUserData",
          jobName,
        },
      },
    });
    throw error;
  }
}

export async function syncUserData() {
  console.info(`STARTING: ${queueNames.SYNC_USERS}`);

  await syncUserDataQueue.obliterate();

  const users = await prisma.user.findMany();

  const allFids = users.map((user) => user.id);

  const fidBatches = chunk(allFids, BATCH_SIZE);

  console.log(
    `Syncing ${allFids.length} users in ${fidBatches.length} batches...`,
  );

  const day = dayUTC().format("YYYY-MM-DD");

  await syncUserDataQueue.addBulk(
    fidBatches.map((fids, i) => {
      const jobId = `${queueNames.SYNC_USERS}-${day}-batch:${i * BATCH_SIZE + fids.length}`;
      return {
        name: jobId,
        data: { fids },
        opts: { jobId, attempts: 5 },
      };
    }),
  );
}

const queueEvents = new QueueEvents(queueNames.SYNC_USERS, {
  connection: queueConnection,
});

logQueueEvents({ queueEvents, queueName: queueNames.SYNC_USERS });

queueEvents.on("completed", async (job) => {
  const { completed, failed, total } = await getJobCounts(syncUserDataQueue);

  console.info(`done: ${job.jobId} (${completed}/${total}).`);

  if (completed + failed === total) {
    console.log(
      `ALL DONE: ${queueNames.SYNC_USERS} Completed: ${completed}. Failed: ${failed}`,
    );

    await syncUserDataQueue.drain();
  }
});
