import { prisma } from "../prisma";
import { getEligibleTippers } from "./getEligibleTippers";
import { invalidateAllowance } from "./invalidateAllowance";

export async function updateEligibleTippers() {
  const eligibleTippers = await getEligibleTippers();

  const tipMeta = await prisma.tipMeta.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  const allowances = await prisma.tipAllowance.findMany({
    where: {
      createdAt: {
        gt: tipMeta.createdAt,
      },
      invalidatedAmount: {
        not: {
          gt: 0,
        },
      },
    },
  });

  for (const allowance of allowances) {
    const tipper = eligibleTippers.find((t) => t.id === allowance.userId);

    // If no eligible tipper is found, invalidate the remaining allowance
    if (!tipper) {
      console.log(
        `Invalidating remaining allowance for user ${allowance.userId}`,
      );
      await invalidateAllowance(allowance);
    }
  }
}

updateEligibleTippers();
