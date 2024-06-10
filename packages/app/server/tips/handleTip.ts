import { createHmac } from "crypto";
import { publicProcedure } from "server/trpc";
import { handleTip as handleTipUtil } from "./utils/handleTip";

export const handleTip = publicProcedure.mutation(async (opts) => {
  const body = opts.ctx.req.body;

  const isValid = isSignatureValid({
    rawHeaders: opts.ctx.req.rawHeaders,
    bodyString: JSON.stringify(body),
  });

  if (!isValid) {
    throw new Error("Invalid webhook signature");
  }

  const castData = body.data;
  const createdAtMs = body.created_at * 1000;

  await handleTipUtil({
    castData,
    createdAtMs,
  });
});

function isSignatureValid({
  rawHeaders,
  bodyString,
}: {
  rawHeaders: string[];
  bodyString: string;
}) {
  const sigKey = rawHeaders.indexOf("X-Neynar-Signature");
  const sig = sigKey !== -1 ? rawHeaders[sigKey + 1] : null;

  const webhookSecret = process.env.NEYNAR_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error(
      "Make sure you set NEYNAR_WEBHOOK_SECRET in your .env file",
    );
  }

  const hmac = createHmac("sha512", webhookSecret);
  hmac.update(bodyString);

  const generatedSignature = hmac.digest("hex");

  return generatedSignature === sig;
}
