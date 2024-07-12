import { axios } from "@farther/common";
import { requireEnv } from "require-env-variable";

const { NEXT_PUBLIC_ENVIRONMENT: ENV, CRON_SECRET } = requireEnv(
  "NEXT_PUBLIC_ENVIRONMENT",
  "CRON_SECRET",
);

export function generateApiCallCron(pathName: string) {
  const fn = async () => {
    try {
      const response = await axios(`${getBaseUrl()}${pathName}`, {
        method: "POST",
        headers: { Authorization: CRON_SECRET },
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
  return ENV === "production"
    ? "https://farther.social/api/v1/"
    : ENV === "staging"
      ? "https://staging.farther.social/api/v1/"
      : "http://localhost:3000/api/v1/";
}
