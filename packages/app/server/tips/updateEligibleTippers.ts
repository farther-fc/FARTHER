import { adminProcedure } from "server/trpc";
import { updateEligibleTippers as update } from "./utils/updateEligibleTippers";

export const updateEligibleTippers = adminProcedure.mutation(update);
