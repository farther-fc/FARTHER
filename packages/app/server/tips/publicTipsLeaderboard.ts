import { publicProcedure } from "../../server/trpc";
import { tipsLeaderboard } from "./utils/tipsLeaderboard";

export const publicTipsLeaderboard = publicProcedure.query(tipsLeaderboard);
