import { prisma } from "../prisma";

export async function getTipsSince(date: Date) {
  return await prisma.tip.findMany({
    where: {
      invalidTipReason: null,
      createdAt: {
        gte: date,
      },
    },
  });
}
