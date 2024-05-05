import { TWEET_BASE_TOKENS, WAD_SCALER } from "@farther/common";
import { AllocationType, prisma } from "../prisma";

async function setBasePowerAllocations() {
  const allocations = await prisma.allocation.findMany({
    where: {
      type: AllocationType.POWER_USER,
    },
  });

  const totalAllocationSum = allocations.reduce(
    (acc, curr) => acc + BigInt(curr.amount),
    BigInt(0),
  );

  const halfOfTotal = totalAllocationSum / BigInt(2);

  const basePerRecipient = halfOfTotal / BigInt(allocations.length);

  //Update database
  await prisma.allocation.updateMany({
    where: {
      type: AllocationType.POWER_USER,
    },
    data: {
      baseAmount: basePerRecipient.toString(),
    },
  });
}

async function setBaseEvangelistAllocations() {
  //Update database
  await prisma.allocation.updateMany({
    where: {
      type: AllocationType.EVANGELIST,
    },
    data: {
      baseAmount: (BigInt(TWEET_BASE_TOKENS) * WAD_SCALER).toString(),
    },
  });
}

setBasePowerAllocations().catch(console.error);

setBaseEvangelistAllocations().catch(console.error);
