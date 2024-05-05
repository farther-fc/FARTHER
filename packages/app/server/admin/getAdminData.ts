import { AllocationType, prisma } from "@farther/backend";
import { publicProcedure } from "server/trpc";

export const getAdminData = publicProcedure.query(async (opts) => {
  const tweets = await prisma.tweet.findMany({
    select: {
      id: true,
      reward: true,
      allocation: {
        select: {
          id: true,
          amount: true,
          isClaimed: true,
          userId: true,
        },
      },
    },
  });

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
      tweets: true,
    },
  });

  return { powerUserAllocations, tweets };
});
