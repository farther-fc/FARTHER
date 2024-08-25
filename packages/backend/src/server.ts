import { ENVIRONMENT, cronSchedules, isProduction } from "@farther/common";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import cron from "node-cron";
import "../instrument";
import { invalidateEvangelistAllocations } from "./lib/invalidateEvangelistAllocations";
import { createTipperScores } from "./lib/jobQueues/createTipperScores";
import { syncTipperData } from "./lib/jobQueues/syncTipperData";
import { syncUserData } from "./lib/jobQueues/syncUserData";
import { tippeeOpenRankSync } from "./lib/jobQueues/tippeeOpenRankSync";
import { updateEligibleTippers } from "./lib/updateEligibleTippers";

dayjs.extend(utc);

console.info(`server running on ${ENVIRONMENT}`);

cron.schedule(cronSchedules.SYNC_USERS, syncUserData, {
  timezone: "Etc/UTC",
});

cron.schedule(cronSchedules.SYNC_TIPPERS, syncTipperData, {
  timezone: "Etc/UTC",
});

const tippeeOpenRankSchedule = isProduction
  ? cronSchedules.TIPPEE_OPENRANK_SYNC
  : cronSchedules.NEVER_RUN;

cron.schedule(tippeeOpenRankSchedule, tippeeOpenRankSync, {
  timezone: "Etc/UTC",
});

// cron.schedule(cronSchedules.DISTRIBUTE_ALLOWANCES, distributeAllowances, {
//   timezone: "Etc/UTC",
// });

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

cron.schedule(cronSchedules.CREATE_TIPPER_SCORES, createTipperScores, {
  timezone: "Etc/UTC",
});

cron.schedule(
  cronSchedules.INVALIDATE_EVANGELISTS_WITHOUT_PB,
  invalidateEvangelistAllocations,
  {
    timezone: "Etc/UTC",
  },
);
