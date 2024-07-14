import { prisma } from "@farther/backend";
import { getEligibleTippers } from "./getEligibleTippers";
import { invalidateAllowance } from "./invalidateAllowance";

export async function updateEligibleTippers() {
  const tipMeta = await prisma.tipMeta.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  if (!tipMeta) {
    throw new Error("updateEligibleTippers: No tip meta found");
  }

  const allowances = await prisma.tipAllowance.findMany({
    where: {
      createdAt: {
        gte: tipMeta.createdAt,
      },
      invalidatedAmount: null,
    },
  });

  const eligibleTippers = await getEligibleTippers();

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
