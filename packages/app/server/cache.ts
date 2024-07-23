import { cache } from "@lib/cache";
import { apiSchemas } from "@lib/types/apiSchemas";
import { adminProcedure } from "server/trpc";

export const flushCache = adminProcedure
  .input(apiSchemas.flushCache.input)
  .mutation((opts) => {
    const { type, ids } = opts.input;
    if (!type && !ids) {
      return cache.flushAll();
    } else if (type) {
      if (!ids) {
        return cache.flush({ type });
      }
      return cache.flush({ type, ids });
    }
  });

export const flushCacheAll = adminProcedure.mutation(() => cache.flushAll());
