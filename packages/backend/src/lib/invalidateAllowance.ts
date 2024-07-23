import { cacheTypes } from "@farther/common";
import { TipAllowance, prisma } from "../prisma";
import { flushCache } from "./utils/flushCache";

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

  await prisma.$transaction(async (tx) => {
    await tx.tipAllowance.update({
      where: {
        id: allowance.id,
      },
      data: {
        invalidatedAmount: allowance.amount - tipAmount,
      },
    });

    await flushCache({ type: cacheTypes.USER, ids: [allowance.userId] });
  });
}
