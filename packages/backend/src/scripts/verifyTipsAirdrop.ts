import Decimal from "decimal.js";
import { AllocationType, prisma } from "../prisma";

async function verifyTipsAirdrop() {
  const tipsAirdrops = await prisma.airdrop.findMany({
    where: {
      allocations: {
        some: {
          type: AllocationType.TIPS,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const firstAirdropCreatedAt = tipsAirdrops[tipsAirdrops.length - 1].createdAt;

  console.log({ firstAirdropCreatedAt });

  const allocations = await prisma.allocation.findMany({
    where: {
      airdropId: "6e671870-9f5c-4086-8c6d-89bbbccb8ef7",
    },
    select: {
      amount: true,
      tips: {
        select: {
          createdAt: true,
          amount: true,
        },
      },
    },
  });

  // Verify every tip was created after the first tip airdrop
  for (const allocation of allocations) {
    for (const tip of allocation.tips) {
      if (tip.createdAt < firstAirdropCreatedAt) {
        throw new Error(`Tip created before first airdrop: ${tip.createdAt}`);
      }
    }
    // Verify all tip amounts add up to the allocation amount
    const totalTipAmount = new Decimal(
      allocation.tips.reduce((acc, tip) => acc + tip.amount, 0),
    ).mul(10 ** 18);

    if (totalTipAmount.toFixed(0) !== allocation.amount) {
      console.error(
        `Total tip amount does not equal allocation amount: ${totalTipAmount.toFixed(0)} !== ${allocation.amount}. Diff: ${totalTipAmount
          .sub(allocation.amount)
          .div(10 ** 18)
          .toNumber()}`,
      );
    }
  }
}

verifyTipsAirdrop();
