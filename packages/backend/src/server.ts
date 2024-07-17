import { cronSchedules, isProduction } from "@farther/common";
import cron from "node-cron";
import "../instrument";
import { calculateTipperScores } from "./lib/calculateTipperScores";
import { generateApiCallCron } from "./lib/generateApiCallCron";
import { syncUserData } from "./lib/syncUserData";
import { takeOpenRankSnapshot } from "./lib/takeOpenRankSnapshot";

console.log("server running!");

cron.schedule(cronSchedules.SYNC_USER_DATA, syncUserData, {
  timezone: "Etc/UTC",
});

const openrankSnapshotSchedule = isProduction
  ? cronSchedules.OPENRANK_SNAPSHOT
  : cronSchedules.NEVER_RUN;

cron.schedule(openrankSnapshotSchedule, takeOpenRankSnapshot, {
  timezone: "Etc/UTC",
});

cron.schedule(
  cronSchedules.DISTRIBUTE_ALLOWANCES,
  generateApiCallCron("admin.distributeAllowances"),
  {
    timezone: "Etc/UTC",
  },
);

// Eligibility is checked every hour, with a random delay to keep allowance farmers on their toes
cron.schedule(
  isProduction
    ? cronSchedules.UPDATE_ELIGIBLE_TIPPERS
    : cronSchedules.NEVER_RUN,
  () => {
    const randomDelay = Math.floor(Math.random() * 3_600_000);

    const updateEligibleTippers = generateApiCallCron(
      "admin.updateEligibleTippers",
    );

    setTimeout(updateEligibleTippers, isProduction ? randomDelay : 0);
  },
);

cron.schedule(cronSchedules.CALCULATE_TIPPER_SCORES, calculateTipperScores, {
  timezone: "Etc/UTC",
});
