import { ENVIRONMENT } from "@farther/common";
import { Queue } from "bullmq";
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
  TIPPER_SCORES: "TIPPER_SCORES",
  OPENRANK_SNAPSHOT: "OPENRANK_SNAPSHOT",
} as const;

export const syncUserDataQueue = new Queue(queueNames.SYNC_USERS, {
  connection: queueConnection,
});

export const syncTipperDataQueue = new Queue(queueNames.SYNC_TIPPERS, {
  connection: queueConnection,
});

export const updateTipperScoresQueue = new Queue(queueNames.TIPPER_SCORES, {
  connection: queueConnection,
});

export const openRankSnapshotQueue = new Queue(queueNames.OPENRANK_SNAPSHOT, {
  connection: queueConnection,
});
