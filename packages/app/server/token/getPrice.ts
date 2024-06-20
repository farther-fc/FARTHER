import { prisma } from "@farther/backend";
import {
  ENVIRONMENT,
  NEXT_PUBLIC_COINGECKO_API_KEY,
  contractAddresses,
} from "@farther/common";

const PRICE_REFRESH_TIME_MS = 1_200_000; // 20 minutes

export async function getPrice(day?: number) {
  if (
    ENVIRONMENT === "development" &&
    !Boolean(process.env.PROD_AGENT_MODELING)
  ) {
    if (typeof day !== "number") {
      throw new Error("Day is required in development environment");
    }
    return { usd: 0.003 * 1.05 ** day };
  }

  // Get price from database
  const tokenPrice = await prisma.tokenPrice.findFirst({});

  // If stale, fetch from coingecko, store and return that price.
  // Note: this path is also cached via responseMeta in trpcClient.ts to avoid
  // unnecessary database hits.
  if (
    !tokenPrice ||
    Date.now() - tokenPrice.updatedAt.getTime() > PRICE_REFRESH_TIME_MS
  ) {
    console.info("fetching price from coingecko");

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=farther&vs_currencies=usd&x_cg_demo_api_key=${NEXT_PUBLIC_COINGECKO_API_KEY}`,
    );

    const data: { farther: { usd: number } } = await response.json();

    await prisma.tokenPrice.upsert({
      where: { id: contractAddresses.FARTHER },
      create: {
        id: contractAddresses.FARTHER,
        usd: data.farther.usd,
      },
      update: {
        usd: data.farther.usd,
      },
    });

    // Throw error if fetched price is less than 30% or more than 300% the stored price
    if (
      tokenPrice &&
      (data.farther.usd < Number(tokenPrice.usd) * 0.3 ||
        data.farther.usd > Number(tokenPrice.usd) * 3)
    ) {
      throw new Error(
        `Coingecko API Error. Unexpected price variance. Fetched: ${data.farther.usd}, Stored: ${Number(
          tokenPrice.usd,
        )}`,
      );
    }

    return { usd: data.farther.usd };
  }

  return {
    usd: tokenPrice.usd,
  };
}
