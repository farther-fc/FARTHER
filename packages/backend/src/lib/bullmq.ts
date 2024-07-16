import { ENVIRONMENT } from "@farther/common";
import { Queue } from "bullmq";
import Redis from "ioredis";
import { requireEnv } from "require-env-variable";

const { KV_REST_API_URL, KV_REST_API_TOKEN } = requireEnv(
  "KV_REST_API_URL",
  "KV_REST_API_TOKEN",
);

const host =
  KV_REST_API_URL.includes("https://") || KV_REST_API_URL.split("https://")[1];

const getRedisConnection = () =>
  new Redis(`redis://default:${KV_REST_API_TOKEN}@${host}:6379`, {
    maxRetriesPerRequest: null,
    tls: {
      rejectUnauthorized: false,
    },
  });

export const queueConnection =
  ENVIRONMENT === "development"
    ? { host: "localhost", port: 6379 }
    : getRedisConnection();

export const queueNames = {
  SYNC_USER_DATA: "sync_user_data",
};

// Create a new connection in every instance
export const syncUserDataQueue = new Queue(queueNames.SYNC_USER_DATA, {
  connection: queueConnection,
});
