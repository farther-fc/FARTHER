import { getPrice as getPriceUtil } from "@farther/backend";
import { publicProcedure } from "server/trpc";

export const getPrice = publicProcedure.query(() => getPriceUtil());
