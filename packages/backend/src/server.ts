import { ENVIRONMENT, OPENRANK_SNAPSHOT_CRON } from "@farther/common";
import cron from "node-cron";
import { takeOpenRankSnapshot } from "./lib/takeOpenRankSnapshot";

console.log("server running!");

const schedule =
  ENVIRONMENT === "development" ? "*/15 * * * *" : OPENRANK_SNAPSHOT_CRON;

cron.schedule(schedule, takeOpenRankSnapshot, { timezone: "Etc/UTC" });
