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
  SYNC_USERS: "SYNC_USERS",
  SYNC_TIPPERS: "SYNC_TIPPERS",
  CREATE_TIPPER_SCORES: "CREATE_TIPPER_SCORES",
  OPENRANK_SNAPSHOT: "OPENRANK_SNAPSHOT",
} as const;

export const syncUserDataQueue = new Queue(queueNames.SYNC_USERS, {
  connection: queueConnection,
});

export const syncTipperDataQueue = new Queue(queueNames.SYNC_TIPPERS, {
  connection: queueConnection,
});

export const updateTipperScoresQueue = new Queue(
  queueNames.CREATE_TIPPER_SCORES,
  {
    connection: queueConnection,
  },
);

export const openRankSnapshotQueue = new Queue(queueNames.OPENRANK_SNAPSHOT, {
  connection: queueConnection,
});

export function logQueueEvents({
  queueEvents,
  queueName,
}: {
  queueEvents: QueueEvents;
  queueName: keyof typeof queueNames;
}) {
  queueEvents.on("active", (job) => {
    console.info(`ACTIVE: ${job.jobId}`);
  });

  queueEvents.on("stalled", async (job) => {
    console.error(`STALLED: ${job.jobId}`);
  });

  queueEvents.on("failed", async (job) => {
    const message = `FALED: ${job.jobId}. Reason: ${job.failedReason}`;
    console.error(message);
    Sentry.captureException(message);
  });

  queueEvents.on("error", (error) => {
    console.error(`ERROR error: ${error}`);
    Sentry.captureException(error, {
      captureContext: {
        tags: {
          jobQueue: queueName,
        },
      },
    });
  });
}
