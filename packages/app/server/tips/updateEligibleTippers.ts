import { adminProcedure } from "server/trpc";
import { updateEligibleTippers as update } from "./utils/updateEligibleTippers";

export const maxDuration = 300;

export const updateEligibleTippers = adminProcedure.mutation(update);
