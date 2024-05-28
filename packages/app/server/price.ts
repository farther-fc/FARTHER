import { prisma } from "@farther/backend";
import { contractAddresses } from "@farther/common";
import { publicProcedure } from "server/trpc";

if (!process.env.COINGECKO_API_KEY) {
  throw new Error("COINGECKO_API_KEY is not set");
}

export const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

const REFRESH_TIME = 20 * 60 * 1000; // 20 minutes

export const getPrice = publicProcedure.mutation(async (opts) => {
  // Get price from database
  const tokenPrice = await prisma.tokenPrice.findFirst({});

  // If stale, fetch from coingecko, store and return that price.
  if (
    !tokenPrice ||
    Date.now() - tokenPrice.updatedAt.getTime() > REFRESH_TIME
  ) {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=farther&vs_currencies=usd&x_cg_demo_api_key=${COINGECKO_API_KEY}`,
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
