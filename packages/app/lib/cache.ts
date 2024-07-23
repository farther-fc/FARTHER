import { CacheType, cacheTimes } from "@farther/common";
import kv from "@vercel/kv";
import { getTipMeta } from "server/tips/publicGetTipsMeta";
import { publicTipsByTipper } from "server/tips/utils/publicTipsByTipper";
import { getLeaderboardData } from "server/tips/utils/tipsLeaderboard";
import { getUncachedPublicUser } from "server/user";
import { keccak256, toBytes } from "viem";

// Maintains a set of cache keys for efficiently finding & flushing cache types (categories)

type CacheTypeMap = {
  USER: Awaited<ReturnType<typeof getUncachedPublicUser>>;
  USER_TIPS: Awaited<ReturnType<typeof publicTipsByTipper>>;
  TIP_META: Awaited<ReturnType<typeof getTipMeta>>;
  LEADERBOARD: Awaited<ReturnType<typeof getLeaderboardData>>;
};

type ID = number;
type Context = Array<number | string | undefined | null>;

type GetArgs<T extends CacheType> = T extends "USER"
  ? { type: T; id: ID; context?: Context }
  : T extends "USER_TIPS"
    ? { type: T; id: ID; context?: Context }
    : { type: T };

type SetArgs<T extends CacheType> = T extends "USER"
  ? { type: T; id: ID; value: CacheTypeMap[T]; context?: Context }
  : T extends "USER_TIPS"
    ? { type: T; id: ID; value: CacheTypeMap[T]; context?: Context }
    : { type: T; value: CacheTypeMap[T] };

const FID_PREFIX = "fid-";

async function set<T extends CacheType>(args: SetArgs<T>) {
  const { type, value } = args;

  let fullKey: string;
  if (type === "USER") {
    const { id, context } = args;

    fullKey = createKey({ type: "USER", id, context });
  } else if (type === "USER_TIPS") {
    const { id, context } = args;

    fullKey = createKey({ type: "USER_TIPS", id, context });
  } else {
    fullKey = createKey({ type });
  }

  const cacheExpiry = cacheTimes[type];

  console.info(`Setting cache for ${fullKey}`);

  await kv.set(fullKey, value, cacheExpiry ? { ex: cacheExpiry } : undefined);
  await kv.sadd(`${type}-keys`, fullKey);
}

async function get<T extends CacheType>(
  args: GetArgs<T>,
): Promise<CacheTypeMap[T] | null> {
  const { type } = args;

  let fullKey: string;
  if (type === "USER") {
    const { id, context } = args;
    fullKey = createKey({ type: "USER", id, context });
  } else if (type === "USER_TIPS") {
    const { id, context } = args;
    fullKey = createKey({ type: "USER_TIPS", id, context });
  } else {
    fullKey = createKey({ type });
  }

  console.info(`Getting cache for ${fullKey}`);

  return kv.get(fullKey);
}

type FlushArgs =
  | { type: "USER"; id?: ID; context?: Context }
  | { type: "USER_TIPS"; id?: ID; context?: Context }
  | { type: Exclude<CacheType, "USER" | "USER_TIPS"> };

async function flush(args: FlushArgs) {
  const { type } = args;

  const currentKey = createKey(args);
  const keysToFlush = await scanKeys(`${currentKey}*`);

  console.info(`Flushing cache for keys: ${keysToFlush}`);

  if (keysToFlush.length > 0) {
    await kv.del(...keysToFlush);
    if (
      (type !== "USER" && type !== "USER_TIPS") ||
      ((type === "USER" || type === "USER_TIPS") && args.id === undefined)
    ) {
      await kv.del(`${type}-keys`);
    }
  }
}

async function scanKeys(pattern: string): Promise<string[]> {
  let cursor = "0";
  let keys: string[] = [];

  do {
    const [newCursor, foundKeys] = await kv.scan(cursor, {
      match: pattern,
      count: 1000, // Adjust the count based on your requirements
    });

    cursor = newCursor;
    keys = keys.concat(foundKeys);
  } while (cursor !== "0");

  return keys;
}

async function flushAll() {
  await kv.flushall();
}

function createKey(
  args:
    | { type: "USER"; id?: ID; context?: Context }
    | { type: "USER_TIPS"; id?: ID; context?: Context }
    | { type: Exclude<CacheType, "USER" | "USER_TIPS"> },
): string {
  const { type } = args;

  if (type === "USER" || type === "USER_TIPS") {
    const { id, context } = args;
    if (!!context && !id) {
      throw new Error(
        "Cannot create a cache key for a USER or USER_TIPS with context but no ID",
      );
    }

    if (!id) {
      return type;
    }

    let fullKey = `${type}:${FID_PREFIX}${id}`;

    // Deterministically sorts & hashes whatever data is in the context array
    if (context) {
      fullKey += `:${keccak256(toBytes(JSON.stringify(context.sort(sortContext))))}`;
    }

    return fullKey;
  }

  return type;
}

const sortContext = (a: Context[number], b: Context[number]) => {
  if (a === undefined) return 1;
  if (b === undefined) return -1;
  if (a === null) return 1;
  if (b === null) return -1;
  if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "string") return -1;
  if (typeof b === "string") return 1;
  return 0;
};

export const cache = {
  get,
  set,
  flush,
  flushAll,
};
