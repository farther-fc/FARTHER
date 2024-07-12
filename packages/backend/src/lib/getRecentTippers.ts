import { prisma } from "../prisma";

export async function getRecentTippers(date: Date) {
  return await prisma.user.findMany({
    where: {
      tipsGiven: {
        some: {
          invalidTipReason: null,
          createdAt: {
            gte: date,
          },
        },
      },
    },
    include: {
      tipsGiven: {
        where: {
          invalidTipReason: null,
          createdAt: {
            gte: date,
          },
        },
      },
    },
  });
}
