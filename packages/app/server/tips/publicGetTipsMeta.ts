import { prisma } from "@farther/backend";
import { cache, cacheTypes } from "@lib/cache";
import { apiSchemas } from "@lib/types/apiSchemas";
import { publicProcedure } from "../trpc";

export const publicGetTipsMeta = publicProcedure
  .input(apiSchemas.publicGetTipsMeta.input)
  .query(async (opts) => {
    const cachedData = await cache.get({
      type: cacheTypes.TIP_META,
    });

    if (cachedData) {
      console.info("Cache hit for tip meta data");

      return cachedData;
    }

    console.info("Cache miss for tip meta data");

    const tipMetaData = await getTipMeta(opts.input?.date);

    cache.set({ type: cacheTypes.TIP_META, value: tipMetaData });

    return tipMetaData;
  });

export async function getTipMeta(date?: string) {
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
    const tipMeta = await prisma.tipMeta.findMany({
      orderBy,
      where: {
        createdAt: {
          gte: new Date(date),
        },
      },
      include,
    });
    return tipMeta.map((meta) => ({
      ...meta,
      createdAt: meta.createdAt.toISOString(),
      updatedAt: meta.updatedAt.toISOString(),
    }));
  }

  const tipMeta = await prisma.tipMeta.findMany({
    orderBy,
    take: 1,
    include,
  });

  return tipMeta.map((meta) => ({
    ...meta,
    createdAt: meta.createdAt.toISOString(),
    updatedAt: meta.updatedAt.toISOString(),
  }));
}
