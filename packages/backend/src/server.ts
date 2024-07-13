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

// const distributeAllowancesSchedule =  "0 16 * * *"

const distributeAllowancesSchedule = "*/10 * * * *";

// cron.schedule(
//   distributeAllowancesSchedule,
//   generateApiCallCron("admin.distributeAllowances"),
//   {
//     timezone: "Etc/UTC",
//   },
// );

generateApiCallCron("admin.distributeAllowances");

// const updatedEligibilitySchedule = isProduction ? "0 * * * *" : NEVER_RUN_CRON;
const updatedEligibilitySchedule = "*/10 * * * *";

cron.schedule(updatedEligibilitySchedule, () => {
  // Random delay to keep allowance farmers on their toes
  const randomDelay = Math.floor(Math.random() * 3_600_000);

  setTimeout(updateEligibleTippers, isProduction ? randomDelay : 0);
});
