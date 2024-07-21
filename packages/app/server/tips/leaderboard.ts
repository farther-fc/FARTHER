import { cache, cacheTypes } from "@lib/cache";
import { adminProcedure, publicProcedure } from "../trpc";
import { tipsLeaderboard } from "./utils/tipsLeaderboard";

export const publicTipsLeaderboard = publicProcedure.query(tipsLeaderboard);

export const flushLeaderboard = adminProcedure.mutation(() =>
  cache.flush({ type: cacheTypes.LEADERBOARD }),
);
