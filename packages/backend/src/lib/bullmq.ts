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

  return new Redis(connectionString, {
    maxRetriesPerRequest: null,
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export const queueConnection =
  ENVIRONMENT === "development"
    ? { host: "localhost", port: 6379 }
    : getRedisConnection();

// NOTE: There is a mysterious bug that causes workers
// to not be called if the queue name is too long 🤷‍♂️
export const queueNames = {
  SYNC_USERS: "sync_users",
  SYNC_TIPPERS: "sync_tippers",
  DISTRIBUTE: "distribute",
} as const;

export const syncUserDataQueue = new Queue(queueNames.SYNC_USERS, {
  connection: queueConnection,
});

export const syncTipperDataQueue = new Queue(queueNames.SYNC_TIPPERS, {
  connection: queueConnection,
});

export const distributeAllowancesQueue = new Queue(queueNames.DISTRIBUTE, {
  connection: queueConnection,
});
