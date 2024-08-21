import { isNeynarSignatureValid } from "server/isNeynarSignatureValid";
import { processTip } from "server/tips/processTip";
import { publicProcedure } from "../trpc";

export const handleTip = publicProcedure.mutation(async (opts) => {
  const body = opts.ctx.req.body;
  const bodyString = JSON.stringify(body);

  const { isValid, sig } = isNeynarSignatureValid({
    rawHeaders: opts.ctx.req.rawHeaders,
    bodyString,
  });

  if (!isValid) {
    throw new Error(`Invalid webhook signature: ${sig}.`);
  }

  const castData = body.data;
  const createdAtMs = body.created_at * 1000;

  await processTip({ castData, createdAtMs });
});
