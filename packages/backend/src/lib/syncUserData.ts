import { neynarLimiter, retryWithExponentialBackoff } from "@farther/common";
import * as Sentry from "@sentry/node";
import Bottleneck from "bottleneck";
import { Worker } from "bullmq";
import { chunk } from "underscore";
import { prisma } from "../prisma";
import { queueConnection, queueNames, syncUserDataQueue } from "./bullmq";

const BATCH_SIZE = 1000;

const scheduler = new Bottleneck({
  maxConcurrent: 8,
  minTime: 20,
});

const worker = new Worker(
  queueNames.SYNC_USER_DATA,
  async function syncUserDataBatch({
    name: jobName,
    data: { fids },
  }: {
    name: string;
    data: { fids: number[] };
  }) {
    console.log(`Processing ${jobName}`);

    try {
      const neynarUserData = await neynarLimiter.getUsersByFid(fids);

      if (neynarUserData.length !== fids.length) {
        throw new Error("Neynar data length does not match user data length");
      }

      const transactions = neynarUserData.map((data, index) =>
        scheduler.schedule(() =>
          retryWithExponentialBackoff(
            async () =>
              await prisma.$transaction(
                async (tx) => {
                  console.log(`Syncing ${index}`);

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
                      connectOrCreate:
                        data.verified_addresses.eth_addresses.map(
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
    } catch (error) {
      console.error("Error syncing user data", error);
      Sentry.captureException(error, {
        captureContext: {
          tags: {
            method: "syncUserData",
          },
        },
      });
      throw error;
    }
  },
  {
    connection: queueConnection,
    concurrency: 5,
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

export async function syncUserData() {
  await syncUserDataQueue.drain();

  const users = await prisma.user.findMany();
  const allFids = users.map((user) => user.id);

  const fidBatches = chunk(allFids, BATCH_SIZE);

  console.log(
    `Syncing ${allFids.length} users in ${fidBatches.length} batches...`,
  );

  syncUserDataQueue.addBulk(
    fidBatches.map((fids, i) => ({
      name: `syncUserDataBatch-${(i + 1) * BATCH_SIZE}`,
      data: { fids },
    })),
  );
}
