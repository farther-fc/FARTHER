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

cron.schedule(openrankSnapshotSchedule, takeOpenRankSnapshot, {
  timezone: "Etc/UTC",
});

cron.schedule("0 16 * * *", generateApiCallCron("admin.distributeAllowances"), {
  timezone: "Etc/UTC",
});

// Eligibility is checked every hour, with a random delay to keep allowance farmers on their toes
cron.schedule(isProduction ? "0 * * * *" : NEVER_RUN_CRON, () => {
  const randomDelay = Math.floor(Math.random() * 3_600_000);

  const updateEligibleTippers = generateApiCallCron(
    "admin.updateEligibleTippers",
  );

  setTimeout(updateEligibleTippers, isProduction ? randomDelay : 0);
});
