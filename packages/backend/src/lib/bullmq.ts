import { ENVIRONMENT } from "@farther/common";
import * as Sentry from "@sentry/node";
import { Queue, QueueEvents } from "bullmq";
import Redis from "ioredis";
import { requireEnv } from "require-env-variable";

const { KV_REST_API_URL, KV_REST_API_TOKEN } = requireEnv(
  "KV_REST_API_URL",
  "KV_REST_API_TOKEN",
);

const host = KV_REST_API_URL.includes("https://")
  ? KV_REST_API_URL.split("https://")[1]
  : KV_REST_API_URL.split("https://")[1];

const getRedisConnection = () => {
  const connectionString = `redis://default:${KV_REST_API_TOKEN}@${host}:6379`;

  const redis = new Redis(connectionString, {
    maxRetriesPerRequest: null,
    tls: {
      rejectUnauthorized: false,
    },
  });

  console.log(
    `Redis connected to host: ${redis.options.host}, port: ${redis.options.port}, db: ${redis.options.db}`,
  );

  return redis;
};

export const queueConnection =
  ENVIRONMENT === "development"
    ? { host: "localhost", port: 6379 }
    : getRedisConnection();

export const queueNames = {
  SYNC_USERS: `SYNC_USERS`,
  SYNC_TIPPERS: `SYNC_TIPPERS`,
  CREATE_TIPPER_SCORES: `CREATE_TIPPER_SCORES`,
  TIPPEE_OPENRANK_SYNC: `TIPPEE_OPENRANK_SYNC`,
} as const;

type ValueOf<T> = T[keyof T];

export type QueueName = ValueOf<typeof queueNames>;

export const syncUserDataQueue = new Queue(queueNames.SYNC_USERS, {
  connection: queueConnection,
});

export const syncTipperDataQueue = new Queue(queueNames.SYNC_TIPPERS, {
  connection: queueConnection,
});

export const createTipperScoresQueue = new Queue(
  queueNames.CREATE_TIPPER_SCORES,
  {
    connection: queueConnection,
  },
);

export const tippeeOpenRankSyncQueue = new Queue(
  queueNames.TIPPEE_OPENRANK_SYNC,
  {
    connection: queueConnection,
  },
);

export function logQueueEvents({
  queueEvents,
  queueName,
}: {
  queueEvents: QueueEvents;
  queueName: QueueName;
}) {
  // queueEvents.on("added", (job) => {
  //   console.info(`added: ${job.jobId}`);
  // });

  // queueEvents.on("active", (job) => {
  //   console.info(`active: ${job.jobId}`);
  // });

  queueEvents.on("stalled", async (job) => {
    console.error(`stalled: ${job.jobId}`);
  });

  queueEvents.on("failed", async (job) => {
    const message = `failed: ${job.jobId}. Reason: ${job.failedReason}`;
    console.error(message);
    Sentry.captureException(message);
  });

  queueEvents.on("error", (error) => {
    console.error(`error: ${error}`);
    Sentry.captureException(error, {
      captureContext: {
        tags: {
          jobQueue: queueName,
        },
      },
    });
  });
}

export async function getJobCounts(queue: Queue) {
  const jobCounts = await queue.getJobCounts();
  const total = Object.values(jobCounts).reduce(
    (total, count) => total + count,
    0,
  );
  return {
    total,
    completed: jobCounts.completed,
    failed: jobCounts.failed,
    active: jobCounts.active,
    stalled: jobCounts.stalled,
    delayed: jobCounts.delayed,
  };
}
