import {
  NEVER_RUN_CRON,
  OPENRANK_SNAPSHOT_CRON,
  isProduction,
} from "@farther/common";
import cron from "node-cron";
import { takeOpenRankSnapshot } from "./lib/takeOpenRankSnapshot";

console.log("server running!");

const schedule = isProduction ? OPENRANK_SNAPSHOT_CRON : NEVER_RUN_CRON;

cron.schedule(schedule, takeOpenRankSnapshot, { timezone: "Etc/UTC" });
