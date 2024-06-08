import { prisma } from "@farther/backend";

export async function getUniqueTippees(tipperFid: number) {
  const tipsToUniqueTipees = await prisma.tip.findMany({
    where: {
      tipperId: tipperFid,
      invalidTipReason: null,
    },
    distinct: ["tippeeId" as const],
  });
  return tipsToUniqueTipees.length;
}
