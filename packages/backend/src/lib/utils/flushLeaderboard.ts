import { API_ENDPOINT_ROOT, axios, cacheTypes } from "@farther/common";

import { requireEnv } from "require-env-variable";

const { CRON_SECRET } = requireEnv("CRON_SECRET");

export async function flushLeaderboard() {
  await axios.post(API_ENDPOINT_ROOT + "/admin.flushCache", {
    method: "POST",
    headers: { Authorization: CRON_SECRET },
    data: { type: cacheTypes.LEADERBOARD },
  });
}
