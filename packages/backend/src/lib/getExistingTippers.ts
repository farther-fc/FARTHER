import { prisma } from "../prisma";

export async function getExistingTippers() {
  const prevTipMeta = await prisma.tipMeta.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  return prisma.user.findMany({
    where: {
      tipAllowances: {
        some: {
          tipMetaId: prevTipMeta?.id,
        },
      },
    },
    include: {
      tipAllowances: {
        include: {
          tips: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      tipsGiven: {
        where: {
          tipAllowance: {
            tipMetaId: prevTipMeta?.id,
          },
          invalidTipReason: null,
        },
        include: {
          tippee: {
            select: {
              tipAllowances: {
                where: {
                  tipMetaId: prevTipMeta?.id,
                },
              },
            },
          },
        },
      },
    },
  });
}
