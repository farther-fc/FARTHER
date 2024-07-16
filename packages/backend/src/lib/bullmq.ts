import { Queue, Worker } from "bullmq";
import { requireEnv } from "require-env-variable";

const { KV_REST_API_URL, KV_REST_API_TOKEN } = requireEnv(
  "KV_REST_API_URL",
  "KV_REST_API_TOKEN",
);

const host = `${KV_REST_API_URL}?_token=${KV_REST_API_TOKEN}`;

export const queueNames = {
  SYNC_USER_DATA: "sync_user_data",
};

const connection = {
  host,
  port: 6379,
};

// Create a new connection in every instance
export const syncUserDataQueue = new Queue(queueNames.SYNC_USER_DATA, {
  connection,
});

const syncUserDataWorker = new Worker(
  queueNames.SYNC_USER_DATA,
  async (job) => {
    console.log("received job!", job.data);
  },
  {
    connection,
  },
);
