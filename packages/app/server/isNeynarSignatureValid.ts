import { ENVIRONMENT } from "@farther/common";
import { createHmac } from "crypto";

export function isNeynarSignatureValid({
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
