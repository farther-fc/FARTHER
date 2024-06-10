import { adminProcedure } from "server/trpc";
import { distributeAllowances as distribute } from "./utils/distributeAllowances";

export const distributeAllowances = adminProcedure.mutation(distribute);
