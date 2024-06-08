import { adminProcedure } from "server/trpc";
import { distributeAllowances as distribute } from "@farther/backend";

export const distributeAllowances = adminProcedure.mutation(distribute);
