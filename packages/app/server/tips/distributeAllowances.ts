import {
  distributeAllowancesQueue,
  queueConnection,
  queueNames,
} from "@farther/common";
import { Worker } from "bullmq";
import dayjs from "dayjs";
import { adminProcedure } from "server/trpc";
import { distributeAllowances as distribute } from "./utils/distributeAllowances";

export const maxDuration = 300;

new Worker(queueNames.DISTRIBUTE_ALLOWANCES, distribute, {
  connection: queueConnection,
});

// Using bullmq with a unique job ID to prevent this from accidentally getting triggered twice
export const distributeAllowances = adminProcedure.mutation(async () => {
  const jobId = `distributeAllowances-${dayjs().format("YYYY-MM-DD-HH")}`;
  distributeAllowancesQueue.add(jobId, {}, { jobId });
});
