import { dayUTC, neynar } from "@farther/common";
import { AllocationType, prisma } from "../prisma";

export async function invalidateEvangelistAllocations() {
  console.info(`Invalidating evangelist allocations without a power badge...`);

  const now = dayUTC();

  const threeMonthsAgo = now.subtract(3, "month").toDate();

  const evangelistAllocations = await prisma.allocation.findMany({
    where: {
      type: AllocationType.EVANGELIST,
      airdrop: null,
      createdAt: {
        lte: threeMonthsAgo,
      },
    },
  });

  const powerBadgeData = await neynar.fetchPowerUsers();

  const pbFids = powerBadgeData.map((pb) => pb.fid);

  const allocationsToInvalidate = evangelistAllocations.filter(
    (evangelist) => !pbFids.includes(evangelist.userId),
  );

  // Verify that createdAt is more than 3 months ago
  for (const allocation of allocationsToInvalidate) {
    if (allocation.createdAt > threeMonthsAgo) {
      throw new Error(
        `Allocation ${allocation.id} was created less than 3 months ago`,
      );
    }
  }

  await prisma.allocation.updateMany({
    where: {
      id: {
        in: allocationsToInvalidate.map((evangelist) => evangelist.id),
      },
    },
    data: {
      isInvalidated: true,
    },
  });

  console.info(
    `Invalidated ${allocationsToInvalidate.length} evangelist allocations`,
  );
}
