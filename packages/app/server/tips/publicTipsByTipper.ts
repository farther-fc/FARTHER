import { apiSchemas } from "@lib/types/apiSchemas";
import { publicTipsByTipper as publicTipsByTipperUtil } from "server/tips/utils/publicTipsByTipper";
import { publicProcedure } from "server/trpc";

export const publicTipsByTipper = publicProcedure
  .input(apiSchemas.publicTipsByTipper.input)
  .query(async (opts) => {
    const { cursor, from, order, limit } = opts.input;

    const uncachedTips = await publicTipsByTipperUtil({
      tipperId: opts.input.fid,
      cursor,
      from,
      order,
      limit,
    });

    return uncachedTips;
  });
