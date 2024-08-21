import { requireEnv } from "require-env-variable";

const { WARPCAST_API_KEY } = requireEnv("WARPCAST_API_KEY");

async function sendDc() {
  const response = await fetch(
    "https://api.warpcast.com/v2/ext-send-direct-cast",
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${WARPCAST_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipientFid: 4378,
        message: `gm. ${new Date().toISOString()}`,
        idempotencyKey: Math.random().toString(36).substring(7),
      }),
    },
  );
}

sendDc();
