import { Worker } from "bullmq";
import dayjs from "dayjs";
import { disconnectCron } from "../crons";
import {
  distributeAllowancesQueue,
  queueConnection,
  queueNames,
} from "./bullmq";
import { generateApiCallCron } from "./generateApiCallCron";

const apiCall = generateApiCallCron("admin.distributeAllowances");

const worker = new Worker(
  queueNames.DISTRIBUTE,
  async function ({ name: jobId }) {
    console.log("Running distributeAllowances", { jobId });

    await apiCall();

    return { jobId };
  },
  {
    connection: queueConnection,
  },
);

// Using bullmq with a unique job ID to prevent this from accidentally getting triggered multiple times
export const distributeAllowancesJob = async () => {
  await distributeAllowancesQueue.drain();

  const jobId = `distributeAllowances-${dayjs().format("YYYY-MM-DD-HH")}`;

  console.log("Adding distributeAllowances job", { jobId });

  await distributeAllowancesQueue.add(jobId, { jobId });
};

worker.on("failed", () => {
  console.log("Worker failed");
});

worker.on("error", (e) => {
  console.log("Worker error", e);
});

worker.on("completed", (_, { jobId }) => {
  console.log(`Job ${jobId} completed.`);
  disconnectCron();
});
