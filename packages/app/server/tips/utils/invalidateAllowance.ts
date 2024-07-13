import { TipAllowance, prisma } from "@farther/backend/src/prisma";

export async function invalidateAllowance(allowance: TipAllowance) {
  const tips = await prisma.tip.findMany({
    where: {
      tipAllowance: {
        id: allowance.id,
      },
      invalidTipReason: null,
    },
  });

  const tipAmount = tips.reduce((acc, tip) => acc + tip.amount, 0);

  return await prisma.tipAllowance.update({
    where: {
      id: allowance.id,
    },
    data: {
      invalidatedAmount: allowance.amount - tipAmount,
    },
  });
}
