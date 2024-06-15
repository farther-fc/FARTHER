import { ENVIRONMENT } from "@farther/common";
import { createHmac } from "crypto";
import { publicProcedure } from "server/trpc";
import { handleTip as handleTipUtil } from "./utils/handleTip";

export const handleTip = publicProcedure.mutation(async (opts) => {
  const body = opts.ctx.req.body;
  const bodyString = JSON.stringify(body);

  const { isValid, sig } = isSignatureValid({
    rawHeaders: opts.ctx.req.rawHeaders,
    bodyString,
  });

  if (!isValid) {
    throw new Error(`Invalid webhook signature: ${sig}.`);
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
  if (ENVIRONMENT === "development") {
    return { isValid: true, sig: null };
  }

  const sigKey = rawHeaders.indexOf("x-neynar-signature");
  const sig = sigKey !== -1 ? rawHeaders[sigKey + 1] : null;

  const webhookSecret = process.env.NEXT_PUBLIC_NEYNAR_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error(
      "Make sure you set NEXT_PUBLIC_NEYNAR_WEBHOOK_SECRET in your .env file",
    );
  }

  const hmac = createHmac("sha512", webhookSecret);
  hmac.update(bodyString);

  const generatedSignature = hmac.digest("hex");

  return { isValid: generatedSignature === sig, sig };
}
