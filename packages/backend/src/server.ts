import { ENVIRONMENT } from "@farther/common";
import cron from "node-cron";
import { takeOpenRankSnapshot } from "./lib/takeOpenRankSnapshot";

console.log("server running!");

const schedule =
  ENVIRONMENT === "development" ? "*/15 * * * *" : `0 */12 * * *`;

cron.schedule(schedule, takeOpenRankSnapshot, { timezone: "Etc/UTC" });
