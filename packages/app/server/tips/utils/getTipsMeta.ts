import { prisma } from "@farther/backend";
import { publicProcedure } from "server/trpc";

export const getTipsMeta = publicProcedure.query(async (opts) => {
  return await prisma.tipMeta.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
    include: {
      _count: {
        select: {
          allowances: true,
        },
      },
    },
  });
});
