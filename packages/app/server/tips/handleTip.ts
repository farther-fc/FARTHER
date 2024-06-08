import { handleTip as handleTipUtil } from "@farther/backend";
import { publicProcedure } from "server/trpc";

export const handleTip = publicProcedure.mutation(async (opts) => {
  await handleTipUtil({
    castData: opts.ctx.req.body.data,
    createdAtMs: opts.ctx.req.body.created_at * 1000,
  });
});
