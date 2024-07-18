import {
  distributeAllowancesQueue,
  queueConnection,
  queueNames,
} from "@farther/common";
import { Worker } from "bullmq";
import dayjs from "dayjs";
import { generateApiCallCron } from "./generateApiCallCron";

const apiCall = generateApiCallCron("admin.distributeAllowances");

new Worker(
  queueNames.DISTRIBUTE_ALLOWANCES,
  async ({ name: jobId }) => {
    console.log("Running distributeAllowances", { jobId });

    const result = await apiCall();

    console.log("distributeAllowances finished. status:", result?.status);
  },
  {
    connection: queueConnection,
  },
);
// Using bullmq with a unique job ID to prevent this from accidentally getting triggered multiple times
export const distributeAllowancesJob = async () => {
  const jobId = `distributeAllowances-${dayjs().format("YYYY-MM-DD-HH")}`;
  distributeAllowancesQueue.add(jobId, {}, { jobId });
};
