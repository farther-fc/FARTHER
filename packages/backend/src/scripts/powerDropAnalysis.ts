import { WAD_SCALER, maxBigInt } from "@farther/common";
import { prisma } from "../prisma";

async function powerDropAverage() {
  const allocations = await prisma.allocation.findMany({
    where: {
      type: "POWER_USER",
    },
    select: {
      amount: true,
    },
  });

  const totalAllocation = allocations.reduce(
    (acc, curr) => acc + BigInt(curr.amount),
    BigInt(0),
  );

  const avgAllocation = totalAllocation / BigInt(allocations.length);

  const bigIntAmounts = allocations.map((a) => BigInt(a.amount));

  const maxAllocation = maxBigInt(...bigIntAmounts);

  console.log(
    `avgAllocation: ${(avgAllocation / WAD_SCALER).toLocaleString()}`,
  );

  console.log(
    `maxAllocation: ${(maxAllocation / WAD_SCALER).toLocaleString()}`,
  );
}

powerDropAverage().catch(console.error);
