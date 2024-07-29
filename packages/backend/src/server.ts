import { ENVIRONMENT, cronSchedules, isProduction } from "@farther/common";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import cron from "node-cron";
import "../instrument";
import { distributeAllowances } from "./lib/distributeAllowances";
import { createTipperScores } from "./lib/jobQueues/createTipperScores";
import { openRankSnapshot } from "./lib/jobQueues/openRankSnapshot";
import { syncTipperData } from "./lib/jobQueues/syncTipperData";
import { syncUserData } from "./lib/jobQueues/syncUserData";
import { updateEligibleTippers } from "./lib/updateEligibleTippers";

dayjs.extend(utc);

/**
 * NOTE: This is currently not being used. The crons are scheduled in Railway directly.
 */

console.info(`server running on ${ENVIRONMENT}`);

cron.schedule(cronSchedules.SYNC_USERS, syncUserData, {
  timezone: "Etc/UTC",
});

cron.schedule(cronSchedules.SYNC_TIPPERS, syncTipperData, {
  timezone: "Etc/UTC",
});

const openrankSnapshotSchedule = isProduction
  ? cronSchedules.OPENRANK_SNAPSHOT
  : cronSchedules.NEVER_RUN;

cron.schedule(openrankSnapshotSchedule, openRankSnapshot, {
  timezone: "Etc/UTC",
});

cron.schedule(cronSchedules.DISTRIBUTE_ALLOWANCES, distributeAllowances, {
  timezone: "Etc/UTC",
});

// Eligibility is checked every hour, with a random delay to keep allowance farmers on their toes
cron.schedule(
  isProduction
    ? cronSchedules.UPDATE_ELIGIBLE_TIPPERS
    : cronSchedules.NEVER_RUN,
  () => {
    const randomDelay = Math.floor(Math.random() * 3_600_000);

    setTimeout(updateEligibleTippers, isProduction ? randomDelay : 0);
  },
  { timezone: "Etc/UTC" },
);

cron.schedule(cronSchedules.UPDATE_TIPPER_SCORES, createTipperScores, {
  timezone: "Etc/UTC",
});

setTimeout(() => {
  throw new Error("testing error to see if it shows up in railway logs");
}, 60_000);
