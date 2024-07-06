import { ENVIRONMENT } from "@farther/common";
import cron from "node-cron";
import {
  SNAPSHOT_DAY,
  takeOpenRankSnapshot,
} from "./utils/takeOpenRankSnapshot";

console.log("server running!");

const schedule =
  ENVIRONMENT === "development" ? "*/15 * * * *" : `0 0 ${SNAPSHOT_DAY} * *`;

cron.schedule(schedule, takeOpenRankSnapshot, { timezone: "Etc/UTC" });
