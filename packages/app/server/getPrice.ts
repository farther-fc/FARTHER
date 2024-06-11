import { publicProcedure } from "server/trpc";
import { getPrice as getPriceUtil } from "./token/getPrice";

export const publicGetPrice = publicProcedure.query(() => getPriceUtil());
