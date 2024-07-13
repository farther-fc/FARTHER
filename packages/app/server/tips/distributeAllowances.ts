import { adminProcedure } from "server/trpc";
import { distributeAllowances as distribute } from "./utils/distributeAllowances";

export const maxDuration = 300;

export const distributeAllowances = adminProcedure.mutation(distribute);
