import { AllocationType, prisma } from "@farther/backend";
import { neynarLimiter } from "@farther/common";
import { publicProcedure } from "server/trpc";

export const getAdminData = publicProcedure.query(async () => {
  const evangelistAllocations = await prisma.allocation.findMany({
    where: {
      type: AllocationType.EVANGELIST,
    },
    select: {
      id: true,
      amount: true,
      address: true,
      isClaimed: true,
      userId: true,
      tweets: {
        select: {
          id: true,
          reward: true,
        },
      },
    },
  });

  const evangelistFids = evangelistAllocations.map((a) => a.userId);

  const neynarData = await neynarLimiter.getUsersByFid(evangelistFids);

  const powerUserAllocations = await prisma.allocation.findMany({
    where: {
      type: AllocationType.POWER_USER,
    },
    select: {
      id: true,
      amount: true,
      address: true,
      isClaimed: true,
      userId: true,
    },
  });

  return {
    powerUserAllocations,
    evangelistAllocations: evangelistAllocations.map((a) => ({
      ...a,
      hasPowerBadge: neynarData.find((u) => u.fid === a.userId)?.power_badge,
    })),
  };
});
