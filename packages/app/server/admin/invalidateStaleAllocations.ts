import { AllocationType, prisma } from "@farther/backend";
import { getPowerBadgeFids } from "@farther/common";
import { publicProcedure } from "server/trpc";

const TWO_MONTHS_IN_MS = 1000 * 60 * 60 * 24 * 60;

export const invalidateStaleAllocations = publicProcedure.query(async () => {
  const pendingAllocations = await prisma.allocation.findMany({
    // Get all pending evangelist allocations
    where: {
      type: AllocationType.EVANGELIST,
      isInvalidated: false,
      airdrop: null,
      createdAt: {
        lt: new Date(Date.now() - TWO_MONTHS_IN_MS),
      },
    },
    select: {
      id: true,
      userId: true,
    },
  });

  const powerBadgeFids = await getPowerBadgeFids();

  const evangelistAllocationsToInvalidate = pendingAllocations.filter(
    (a) => !powerBadgeFids.includes(a.userId),
  );

  await prisma.allocation.updateMany({
    where: {
      id: {
        in: evangelistAllocationsToInvalidate.map((a) => a.id),
      },
    },
    data: {
      isInvalidated: true,
    },
  });
});
