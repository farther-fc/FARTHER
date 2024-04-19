import * as functions from "firebase-functions";
import { defineString } from "firebase-functions/params";
import axios from "axios";

const CRON_SECRET = defineString("CRON_SECRET");
const ENV = defineString("NEXT_PUBLIC_ENVIRONMENT");

exports.updatePowerUsers = functions.pubsub
  .schedule("0 * * * *")
  .onRun(async () => {
    try {
      const response = await axios(`${getBaseUrl()}updatePowerUsers`, {
        headers: { Authorization: `Bearer ${CRON_SECRET.value()}` },
      });

      if (response.status !== 200) {
        throw new Error(
          `updatePowerUsers failed with status ${response.status}`,
        );
      }
      console.log("updatePowerUsers success");
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
