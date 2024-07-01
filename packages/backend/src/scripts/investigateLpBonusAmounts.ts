import { AllocationType, prisma } from "../prisma";

async function investigateLpBonusAmounts() {
  const allocations = await prisma.allocation.findMany({
    where: {
      type: AllocationType.LIQUIDITY,
    },
  });

  console.log("allocations:", allocations.length);

  const badAllocations = [];
  for (const alloc of allocations) {
    if (BigInt(alloc.referenceAmount) * 5n !== BigInt(alloc.amount)) {
      badAllocations.push(alloc);
    }
  }

  for (const alloc of badAllocations) {
    // if (alloc.amount === "0") {
    //   console.log("no amount", alloc);
    // }
    if (BigInt(alloc.referenceAmount) > BigInt(alloc.amount)) {
      console.log(alloc);
    }
    // console.log(
    //   alloc.id,
    //   `diffAsAPercentageOfAmount: ${
    //     (BigInt(alloc.amount) - BigInt(alloc.referenceAmount) * 5n) /
    //     BigInt(alloc.amount)
    //   }`,
    // );
  }
  // console.log("badAllocations:", badAllocations.length);
}

investigateLpBonusAmounts();
