import kv from "@vercel/kv";
import { getTipMeta } from "server/tips/publicGetTipsMeta";
import { getLeaderboardData } from "server/tips/utils/tipsLeaderboard";
import { getUncachedPublicUser } from "server/user";

// Maintains a set of cache keys for efficiently finding & flushing cache types (categories)

export const cacheTypes = {
  USER: "USER",
  TIP_META: "TIP_META",
  LEADERBOARD: "LEADERBOARD",
} as const;

export type CacheType = (typeof cacheTypes)[keyof typeof cacheTypes];

type CacheTypeMap = {
  USER: Awaited<ReturnType<typeof getUncachedPublicUser>>;
  TIP_META: Awaited<ReturnType<typeof getTipMeta>>;
  LEADERBOARD: Awaited<ReturnType<typeof getLeaderboardData>>;
};

type UserKeyType = {
  address?: string;
  fid?: number;
};

type GetArgs<T extends CacheType> = T extends "USER"
  ? { type: T; key: UserKeyType }
  : { type: T };

type SetArgs<T extends CacheType> = {
  type: T;
  value: CacheTypeMap[T];
} & (T extends "USER" ? { key: UserKeyType } : { key?: never });

async function set<T extends CacheType>(args: SetArgs<T>) {
  const { type, value } = args;

  let fullKey: string;
  if (type === "USER") {
    if (!("key" in args) || !args.key) {
      throw new Error("Key is required for USER type");
    }
    fullKey = createKey({ type: "USER", key: args.key });
  } else {
    fullKey = createKey({ type });
  }

  await kv.set(fullKey, value);
  await kv.sadd(`${type}-keys`, fullKey);
}

async function get<T extends CacheType>(
  args: GetArgs<T>,
): Promise<CacheTypeMap[T] | null> {
  const { type } = args;

  let fullKey: string;
  if (type === "USER") {
    fullKey = createKey({
      type: "USER",
      key: (args as { key: UserKeyType }).key,
    });
  } else {
    fullKey = createKey({ type });
  }

  return kv.get(fullKey);
}

async function flush(type: CacheType) {
  const keys = await kv.smembers(`${type}-keys`);
  if (keys.length > 0) {
    await kv.del(...keys);
    await kv.del(`${type}-keys`);
  }
}

function createKey(
  args:
    | { type: "USER"; key: UserKeyType }
    | { type: Exclude<CacheType, "USER"> },
): string {
  const { type } = args;

  if (type === "USER") {
    const { key } = args;
    if (!key.address && !key.fid) {
      throw new Error("Must provide address or fid");
    }
    if (key.address) {
      return `${type}${key.address}`;
    }
    if (key.fid) {
      return `${type}${key.fid}`;
    }
    throw new Error("Unexpected error: Neither address nor fid provided");
  }

  return type;
}
export const cache = {
  get,
  set,
  flush,
};
