import {
  NEVER_RUN_CRON,
  OPENRANK_SNAPSHOT_CRON,
  isProduction,
} from "@farther/common";
import cron from "node-cron";
import "../instrument";
import { generateApiCallCron } from "./lib/generateApiCallCron";
import { takeOpenRankSnapshot } from "./lib/takeOpenRankSnapshot";
import { updateEligibleTippers } from "./lib/updateEligibleTippers";

console.log("server running!");

const openrankSnapshotSchedule = isProduction
  ? OPENRANK_SNAPSHOT_CRON
  : NEVER_RUN_CRON;

cron.schedule(openrankSnapshotSchedule, takeOpenRankSnapshot, {
  timezone: "Etc/UTC",
});

const distributeAllowancesSchedule = "0 16 * * *";

cron.schedule(
  distributeAllowancesSchedule,
  generateApiCallCron("admin.distributeAllowances"),
  {
    timezone: "Etc/UTC",
  },
);

cron.schedule("0 * * * *", updateEligibleTippers);
