import { cacheTimes } from "@farther/common";
import { publicProcedure } from "server/trpc";
import { getPrice as getPriceUtil } from "./token/getPrice";

export const publicGetPrice = publicProcedure.query((opts) => {
  opts.ctx.res.setHeader(
    "cache-control",
    `s-maxage=${cacheTimes.PUBLIC_PRICE}, stale-while-revalidate=1`,
  );

  return getPriceUtil();
});
