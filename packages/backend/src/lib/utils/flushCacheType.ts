import {
  API_ENDPOINT_ROOT,
  CacheType,
  retryWithExponentialBackoff,
} from "@farther/common";

import { requireEnv } from "require-env-variable";

const { CRON_SECRET } = requireEnv("CRON_SECRET");

export async function flushCacheType(type: CacheType) {
  await retryWithExponentialBackoff(async () => {
    await fetch(API_ENDPOINT_ROOT + "/admin.flushCacheType", {
      method: "POST",
      headers: { Authorization: CRON_SECRET },
      body: JSON.stringify({ type }),
    });
  });
}
