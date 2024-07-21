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

type GetArgs<T extends CacheType> = T extends "USER"
  ? { type: T; id: number }
  : T extends "USER_TIPS"
    ? { type: T; id: number }
    : { type: T };

type SetArgs<T extends CacheType> = T extends "USER"
  ? { type: T; id: number; value: CacheTypeMap[T] }
  : T extends "USER_TIPS"
    ? { type: T; id: number; value: CacheTypeMap[T] }
    : { type: T; value: CacheTypeMap[T] };

async function set<T extends CacheType>(args: SetArgs<T>) {
  const { type, value } = args;

  let fullKey: string;
  if (type === "USER") {
    const { id } = args;
    if (typeof id !== "number") {
      throw new Error("ID must be a number for USER type");
    }
    fullKey = createKey({ type: "USER", id });
  } else if (type === "USER_TIPS") {
    const { id } = args;
    if (typeof id !== "number") {
      throw new Error("ID must be a number for USER_TIPS type");
    }
    fullKey = createKey({ type: "USER_TIPS", id });
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
    const { id } = args;
    fullKey = createKey({ type: "USER", id });
  } else if (type === "USER_TIPS") {
    const { id } = args;
    fullKey = createKey({ type: "USER_TIPS", id });
  } else {
    fullKey = createKey({ type });
  }

  console.info(`Getting cache for ${fullKey}`);

  return kv.get(fullKey);
}

type FlushArgs =
  | { type: "USER"; id?: number }
  | { type: "USER_TIPS"; id?: number }
  | { type: Exclude<CacheType, "USER" | "USER_TIPS"> };

async function flush(args: FlushArgs) {
  const { type } = args;
  console.info(`Flushing cache for ${type}`);

  let keys: string[];

  if (
    (type === "USER" || type === "USER_TIPS") &&
    "id" in args &&
    args.id !== undefined
  ) {
    const fullKey = createKey(args);
    keys = [fullKey];
  } else if (type === "USER" || type === "USER_TIPS") {
    keys = await kv.keys(`${type}:*`);
  } else {
    keys = await kv.smembers(`${type}-keys`);
  }

  if (keys.length > 0) {
    await kv.del(...keys);
    await kv.del(`${type}-keys`);
  }
}

function createKey(
  args:
    | { type: "USER"; id?: number }
    | { type: "USER_TIPS"; id?: number }
    | { type: Exclude<CacheType, "USER" | "USER_TIPS"> },
): string {
  const { type } = args;

  if (type === "USER") {
    const { id } = args;
    if (id === undefined) {
      throw new Error("Must provide id for USER key");
    }
    return `${type}:${id}`;
  }

  if (type === "USER_TIPS") {
    const { id } = args;
    if (id === undefined) {
      throw new Error("Must provide id for USER_TIPS key");
    }
    return `${type}:${id}`;
  }

  return type;
}
export const cache = {
  get,
  set,
  flush,
};
