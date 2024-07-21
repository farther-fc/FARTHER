import { cacheTypes } from "@farther/common";
import { cache } from "@lib/cache";
import { apiSchemas } from "@lib/types/apiSchemas";
import { publicTipsByTipper as publicTipsByTipperUtil } from "server/tips/utils/publicTipsByTipper";
import { publicProcedure } from "server/trpc";

export const publicTipsByTipper = publicProcedure
  .input(apiSchemas.publicTipsByTipper.input)
  .query(async (opts) => {
    const { cursor, from, order, limit } = opts.input;

    const tips = await cache.get({
      type: cacheTypes.USER_TIPS,
      id: opts.input.fid,
    });

    if (tips) {
      return tips;
    }

    const uncachedTips = await publicTipsByTipperUtil({
      tipperId: opts.input.fid,
      cursor,
      from,
      order,
      limit,
    });

    await cache.set({
      type: cacheTypes.USER_TIPS,
      id: opts.input.fid,
      value: uncachedTips,
    });

    return uncachedTips;
  });
