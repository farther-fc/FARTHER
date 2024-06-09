import axios from "axios";
import { defineString } from "firebase-functions/params";

const CRON_SECRET = defineString("CRON_SECRET");
const ENV = defineString("NEXT_PUBLIC_ENVIRONMENT");

export function generateCronJob(pathName: string) {
  const fn = async () => {
    try {
      const response = await axios(`${getBaseUrl()}${pathName}`, {
        method: "POST",
        headers: { Authorization: CRON_SECRET.value() },
      });

      if (response.status !== 200) {
        throw new Error(`${pathName} failed with status ${response.status}`);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e);
      }
    }
  };

  return fn;
}

function getBaseUrl() {
  return ENV.value() === "production"
    ? "https://farther.social/api/v1/"
    : ENV.value() === "staging"
      ? "https://staging.farther.social/api/v1/"
      : "http://localhost:3000/api/v1/";
}
