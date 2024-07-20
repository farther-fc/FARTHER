import { cacheTimes } from "@farther/common";
import kv from "@vercel/kv";
import { getTipMeta } from "server/tips/publicGetTipsMeta";
import { publicTipsByTipper } from "server/tips/utils/publicTipsByTipper";
import { getLeaderboardData } from "server/tips/utils/tipsLeaderboard";
import { getUncachedPublicUser } from "server/user";

// Maintains a set of cache keys for efficiently finding & flushing cache types (categories)

export const cacheTypes = {
  USER: "USER",
  USER_TIPS: "USER_TIPS",
  TIP_META: "TIP_META",
  LEADERBOARD: "LEADERBOARD",
} as const;

export type CacheType = (typeof cacheTypes)[keyof typeof cacheTypes];

type CacheTypeMap = {
  USER: Awaited<ReturnType<typeof getUncachedPublicUser>>;
  USER_TIPS: Awaited<ReturnType<typeof publicTipsByTipper>>;
  TIP_META: Awaited<ReturnType<typeof getTipMeta>>;
  LEADERBOARD: Awaited<ReturnType<typeof getLeaderboardData>>;
};

type UserKeyType = {
  address?: string;
  fid?: number;
};

type GetArgs<T extends CacheType> = T extends "USER"
  ? { type: T; key: UserKeyType }
  : T extends "USER_TIPS"
    ? { type: T; key: number }
    : { type: T };

type SetArgs<T extends CacheType> = T extends "USER"
  ? { type: T; key: UserKeyType; value: CacheTypeMap[T] }
  : T extends "USER_TIPS"
    ? { type: T; key: number; value: CacheTypeMap[T] }
    : { type: T; value: CacheTypeMap[T] };

async function set<T extends CacheType>(args: SetArgs<T>) {
  const { type, value } = args;

  let fullKey: string;
  if (type === "USER") {
    const { key } = args;
    if (!key) {
      throw new Error("Key is required for USER type");
    }
    fullKey = createKey({ type: "USER", key });
  } else if (type === "USER_TIPS") {
    const { key } = args;
    if (typeof key !== "number") {
      throw new Error("Key must be a number for USER_TIPS type");
    }
    fullKey = createKey({ type: "USER_TIPS", key });
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
    const { key } = args;
    fullKey = createKey({ type: "USER", key });
  } else if (type === "USER_TIPS") {
    const { key } = args;
    fullKey = createKey({ type: "USER_TIPS", key });
  } else {
    fullKey = createKey({ type });
  }

  console.info(`Getting cache for ${fullKey}`);

  return kv.get(fullKey);
}

async function flush(type: CacheType) {
  console.info(`Flushing cache for ${type}`);

  const keys = await kv.smembers(`${type}-keys`);
  if (keys.length > 0) {
    await kv.del(...keys);
    await kv.del(`${type}-keys`);
  }
}

function createKey(
  args:
    | { type: "USER"; key: UserKeyType }
    | { type: "USER_TIPS"; key: number }
    | { type: Exclude<CacheType, "USER" | "USER_TIPS"> },
): string {
  const { type } = args;

  if (type === "USER") {
    const { key } = args;
    if (!key.address && !key.fid) {
      throw new Error("Must provide address or fid");
    }
    if (key.address) {
      return `${type}:${key.address}`;
    }
    if (key.fid) {
      return `${type}:${key.fid}`;
    }
    throw new Error("Unexpected error: Neither address nor fid provided");
  }

  if (type === "USER_TIPS") {
    return `${type}:${args.key}`;
  }

  return type;
}
export const cache = {
  get,
  set,
  flush,
};
