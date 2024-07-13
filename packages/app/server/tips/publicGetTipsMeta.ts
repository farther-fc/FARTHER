import { prisma } from "@farther/backend";
import { apiSchemas } from "@lib/types/apiSchemas";
import { publicProcedure } from "server/trpc";

export const publicGetTipsMeta = publicProcedure
  .input(apiSchemas.publicGetTipsMeta.input)
  .query(async (opts) => {
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
