import { prisma } from "@farther/backend";
import { contractAddresses } from "@farther/common";
import { PRICE_REFRESH_TIME } from "@lib/constants";
import { publicProcedure } from "server/trpc";

if (!process.env.NEXT_PUBLIC_COINGECKO_API_KEY) {
  throw new Error("NEXT_PUBLIC_COINGECKO_API_KEY is not set");
}

export const NEXT_PUBLIC_COINGECKO_API_KEY =
  process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

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

    if (!data.farther.usd) {
      throw new Error("Coingecko API Error: Farther price not found");
    }

    const priceWad = BigInt(data.farther.usd * 10 ** 18).toString();

    await prisma.tokenPrice.upsert({
      where: { id: contractAddresses.FARTHER },
      create: {
        id: contractAddresses.FARTHER,
        price: priceWad,
      },
      update: {
        price: priceWad,
      },
    });

    return data.farther.usd;
  }

  return Number(BigInt(tokenPrice.price).toString()) / 10 ** 18;
});
