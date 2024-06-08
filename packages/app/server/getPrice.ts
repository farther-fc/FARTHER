import { prisma } from "@farther/backend";
import {
  NEXT_PUBLIC_COINGECKO_API_KEY,
  PRICE_REFRESH_TIME,
  contractAddresses,
} from "@farther/common";
import { publicProcedure } from "server/trpc";

export const getPrice = publicProcedure.query(async () => {
  // Get price from database
  const tokenPrice = await prisma.tokenPrice.findFirst({});

  // If stale, fetch from coingecko, store and return that price.
  // Note: this path is also cached via responseMeta in trpcClient.ts to avoid
  // unnecessary database hits.
  if (
    !tokenPrice ||
    Date.now() - tokenPrice.updatedAt.getTime() > PRICE_REFRESH_TIME
  ) {
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
});
