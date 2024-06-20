import { prisma } from "@farther/backend";
import { TIP_META_RESET_HOUR, cacheTimes } from "@farther/common";
import { apiSchemas } from "@lib/types/apiSchemas";
import { publicProcedure } from "server/trpc";

export const publicGetTipsMeta = publicProcedure
  .input(apiSchemas.publicGetTipsMeta.input)
  .query(async (opts) => {
    const date = new Date();
    const utcHours = date.getUTCHours();
    const utcMinutes = date.getUTCMinutes();

    // Reset cache every day at reset hour
    const cacheDuration =
      utcHours === TIP_META_RESET_HOUR &&
      // 15 minute window to reset cache
      utcMinutes < 15
        ? 0
        : cacheTimes.PUBLIC_TIP_META;

    opts.ctx.res.setHeader(
      "cache-control",
      `s-maxage=${cacheDuration}, stale-while-revalidate=1`,
    );

    const orderBy = {
      createdAt: "desc",
    } as const;
    const include = {
      _count: {
        select: {
          allowances: true,
        },
      },
    } as const;

    if (opts.input?.date) {
      return await prisma.tipMeta.findMany({
        orderBy,
        where: {
          createdAt: {
            gte: new Date(opts.input.date),
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
  });
