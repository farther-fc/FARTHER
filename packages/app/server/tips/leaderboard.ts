import { publicProcedure } from "../trpc";
import { tipsLeaderboard } from "./utils/tipsLeaderboard";

export const publicTipsLeaderboard = publicProcedure.query(tipsLeaderboard);
