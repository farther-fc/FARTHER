import { ENVIRONMENT } from "@farther/common";
import { Queue, Worker } from "bullmq";

const host =
  ENVIRONMENT === "development" ? "localhost" : process.env.KV_REST_API_URL;

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
