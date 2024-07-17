import { prisma } from "../prisma";

export async function getTippersByDate({
  from,
  to = new Date(),
}: {
  from: Date;
  to?: Date;
}) {
  return await prisma.user.findMany({
    where: {
      tipsGiven: {
        some: {
          invalidTipReason: null,
          tippeeOpenRankScore: {
            not: null,
          },
          createdAt: {
            gte: from,
            lt: to,
          },
        },
      },
    },
    include: {
      tipsGiven: {
        where: {
          invalidTipReason: null,
          tippeeOpenRankScore: {
            not: null,
          },
          createdAt: {
            gte: from,
            lt: to,
          },
        },
      },
    },
  });
}
