import { cache } from "@lib/cache";
import { apiSchemas } from "@lib/types/apiSchemas";
import { adminProcedure } from "server/trpc";

export const flushCacheType = adminProcedure
  .input(apiSchemas.flushCacheType.input)
  .mutation((opts) => cache.flush({ type: opts.input.type }));

export const flushCacheAll = adminProcedure.mutation(() => cache.flushAll());
