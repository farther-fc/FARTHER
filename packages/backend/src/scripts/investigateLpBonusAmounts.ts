import { WAD_SCALER } from "@farther/common";
import { AllocationType, prisma } from "../prisma";

const prettify = (num: string | bigint) => {
  return (BigInt(num) / WAD_SCALER).toLocaleString();
};

// Did this only happen to allocations for users who received allocations in the previous season? YES
// Did this happen to every season 2 allocation?

async function investigateLpBonusAmounts() {
  const users = await getUsers();

  const badAllocations: Array<
    Awaited<ReturnType<typeof getUsers>>[number]["allocations"][number] & {
      allocationCount: number;
    }
  > = [];

  for (const user of users) {
    for (const alloc of user.allocations) {
      if (BigInt(alloc.referenceAmount) * 5n !== BigInt(alloc.amount)) {
        badAllocations.push({
          ...alloc,
          allocationCount: user.allocations.length,
        });
      }
    }
  }

  for (const alloc of badAllocations) {
    // if (alloc.amount === "0") {
    //   console.log("no amount", alloc);
    // }

    console.log({
      // allocId: alloc.id,
      // created: alloc.createdAt,
      // updated: alloc.updatedAt,
      // referenceAmount: prettify(alloc.referenceAmount),
      referenceAmount: alloc.referenceAmount,
      // amount: prettify(alloc.amount),
      address: alloc.address,
      amount: prettify(alloc.amount),
      diff: prettify(BigInt(alloc.amount) - BigInt(alloc.referenceAmount) * 5n),
      allocationCount: alloc.allocationCount,
    });

    // console.log(
    //   `created`,
    //   alloc.createdAt,
    //   `referenceAmount`,
    //   prettify(alloc.referenceAmount),
    //   `amount`,
    //   prettify(alloc.amount),
    //   `diff`,
    //   prettify(BigInt(alloc.amount) - BigInt(alloc.referenceAmount)),
    // );

    // console.log(
    //   alloc.id,
    //   `diffAsAPercentageOfAmount: ${
    //     (BigInt(alloc.amount) - BigInt(alloc.referenceAmount) * 5n) /
    //     BigInt(alloc.amount)
    //   }`,
    // );
  }
  console.log(
    "allocations:",
    users.reduce((total, cur) => total + cur.allocations.length, 0),
  );
  console.log("badAllocations:", badAllocations.length);
}

async function getUsers() {
  return await prisma.user.findMany({
    where: {
      allocations: {
        some: {
          type: AllocationType.LIQUIDITY,
          createdAt: {
            gte: new Date("2024-06-15T23:47:16.887Z"),
          },
        },
      },
    },
    select: {
      allocations: {
        where: {
          type: AllocationType.LIQUIDITY,
        },
      },
    },
  });
}

investigateLpBonusAmounts();
