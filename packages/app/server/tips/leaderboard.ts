import { cacheTypes } from "@farther/common";
import { cache } from "@lib/cache";
import { adminProcedure, publicProcedure } from "../trpc";
import { tipsLeaderboard } from "./utils/tipsLeaderboard";

export const publicTipsLeaderboard = publicProcedure.query(tipsLeaderboard);

export const flushLeaderboard = adminProcedure.mutation(() =>
  cache.flush({ type: cacheTypes.LEADERBOARD }),
);
