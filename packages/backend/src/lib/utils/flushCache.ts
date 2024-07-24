import {
  API_ENDPOINT_ROOT,
  CacheType,
  retryWithExponentialBackoff,
} from "@farther/common";

import { requireEnv } from "require-env-variable";

const { CRON_SECRET } = requireEnv("CRON_SECRET");

export async function flushCache({
  type,
  ids,
}: {
  type?: CacheType;
  ids?: number[];
}) {
  await retryWithExponentialBackoff(async () => {
    await fetch(API_ENDPOINT_ROOT + "/admin.flushCache", {
      method: "POST",
      headers: { Authorization: CRON_SECRET },
      body: JSON.stringify({ type, ids }),
    });
  });
}
