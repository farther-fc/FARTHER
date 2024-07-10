import {
  NEVER_RUN_CRON,
  OPENRANK_SNAPSHOT_CRON,
  isProduction,
} from "@farther/common";
import cron from "node-cron";
import "../instrument";
import { generateApiCallCron } from "./lib/generateApiCallCron";
import { takeOpenRankSnapshot } from "./lib/takeOpenRankSnapshot";

console.log("server running!");

const openrankSnapshotSchedule = isProduction
  ? OPENRANK_SNAPSHOT_CRON
  : NEVER_RUN_CRON;

console.log({ openrankSnapshotSchedule });

cron.schedule(openrankSnapshotSchedule, takeOpenRankSnapshot, {
  timezone: "Etc/UTC",
});

const distributeAllowancesSchedule = isProduction
  ? "0 16 * * *"
  : "*/5 * * * *";

cron.schedule(
  distributeAllowancesSchedule,
  generateApiCallCron("admin.distributeAllowances"),
  {
    timezone: "Etc/UTC",
  },
);
