import axios from "axios";
import * as functions from "firebase-functions";
import { defineString } from "firebase-functions/params";

const CRON_SECRET = defineString("CRON_SECRET");
const ENV = defineString("NEXT_PUBLIC_ENVIRONMENT");

exports.invalidateStaleAllocations = functions.pubsub
  .schedule("0 2 * * *")
  .onRun(async () => {
    try {
      const response = await axios(
        `${getBaseUrl()}invalidateStaleAllocations`,
        {
          headers: { Authorization: `Bearer ${CRON_SECRET.value()}` },
        },
      );

      if (response.status !== 200) {
        throw new Error(
          `invalidateStaleAllocations failed with status ${response.status}`,
        );
      }

      console.info("updatePowerUsers success");
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e);
      }
    }
  });

function getBaseUrl() {
  return ENV.value() === "production"
    ? "https://farther.social/api/"
    : ENV.value() === "staging"
      ? "https://staging.farther.social/api/"
      : "http://localhost:3000/api/";
}
