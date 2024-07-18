import { prisma } from "@farther/backend";
import { cacheKeys, cacheTimes } from "@farther/common";
import { apiSchemas } from "@lib/types/apiSchemas";
import { kv } from "@vercel/kv";
import { publicProcedure } from "server/trpc";

export const publicGetTipsMeta = publicProcedure
  .input(apiSchemas.publicGetTipsMeta.input)
  .query(async (opts) => {
    const cachedData = await kv.get<Awaited<ReturnType<typeof getTipMeta>>>(
      cacheKeys.TIP_META,
    );

    if (cachedData) {
      console.info("Cache hit for tip meta data");

      return cachedData;
    }

    console.info("Cache miss for tip meta data");

    const tipMetaData = await getTipMeta(opts.input?.date);

    kv.set(cacheKeys.TIP_META, tipMetaData, { ex: cacheTimes.TIP_META });

    return tipMetaData;
  });

async function getTipMeta(date?: string) {
  const orderBy = {
    createdAt: "desc",
  } as const;

  const include = {
    _count: {
      select: {
        allowances: {
          where: {
            invalidatedAmount: null,
          },
        },
      },
    },
  } as const;

  if (date) {
    return await prisma.tipMeta.findMany({
      orderBy,
      where: {
        createdAt: {
          gte: new Date(date),
        },
      },
      include,
    });
  }

  return await prisma.tipMeta.findMany({
    orderBy,
    take: 1,
    include,
  });
}
