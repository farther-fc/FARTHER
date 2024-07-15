import { adminProcedure, publicProcedure } from "../trpc";
import { flushCache, tipsLeaderboard } from "./utils/tipsLeaderboard";

export const publicTipsLeaderboard = publicProcedure.query(tipsLeaderboard);

export const flushLeaderboard = adminProcedure.mutation(() => flushCache());
