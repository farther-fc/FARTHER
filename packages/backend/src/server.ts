import { cronSchedules, isProduction } from "@farther/common";
import cron from "node-cron";
import "../instrument";
import { syncTipperData } from "./lib/syncTipperData";
import { syncUserData } from "./lib/syncUserData";
import { takeOpenRankSnapshot } from "./lib/takeOpenRankSnapshot";
import { updateTipperScores } from "./lib/updateTipperScores";
import { generateApiCallCron } from "./lib/utils/generateApiCallCron";

/**
 * NOTE: This is currently not being used. The crons are scheduled in Railway directly.
 */

console.log("server running!");

cron.schedule(cronSchedules.SYNC_USERS, syncUserData, {
  timezone: "Etc/UTC",
});

cron.schedule(cronSchedules.SYNC_TIPPERS, syncTipperData, {
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

cron.schedule(cronSchedules.UPDATE_TIPPER_SCORES, updateTipperScores, {
  timezone: "Etc/UTC",
});
