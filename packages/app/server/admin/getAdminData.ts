import { prisma } from "@farther/backend";
import { publicProcedure } from "server/trpc";

export const getAdminData = publicProcedure.query(async () => {
  // const evangelistAllocations = await prisma.allocation.findMany({
  //   where: {
  //     type: AllocationType.EVANGELIST,
  //   },
  //   select: {
  //     id: true,
  //     amount: true,
  //     address: true,
  //     isClaimed: true,
  //     userId: true,
  //     isInvalidated: true,
  //     tweets: {
  //       select: {
  //         id: true,
  //         reward: true,
  //         followerCount: true,
  //       },
  //     },
  //   },
  // });

  // const evangelistFids = evangelistAllocations.map((a) => a.userId);

  // const neynarData = await neynarLimiter.getUsersByFid(evangelistFids);

  // const powerUserAllocations = await prisma.allocation.findMany({
  //   where: {
  //     type: AllocationType.POWER_USER,
  //   },
  //   select: {
  //     id: true,
  //     amount: true,
  //     address: true,
  //     isClaimed: true,
  //     userId: true,
  //     baseAmount: true,
  //     referenceAmount: true,
  //   },
  // });

  const validTipCount = await prisma.tip.count({
    where: {
      invalidTipReason: null,
    },
  });

  const invalidTipCount = await prisma.tip.count({
    where: {
      invalidTipReason: {
        not: null,
      },
    },
  });

  const tipAggregations = await prisma.tip.aggregate({
    where: {
      createdAt: {
        gt: new Date("2024-08-01T00:00:00Z"),
      },
    },
    _avg: {
      amount: true,
    },
  });

  const tipMeta = await prisma.tipMeta.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  const latestAllowances = tipMeta
    ? await prisma.tipAllowance.findMany({
        where: {
          tipMetaId: tipMeta.id,
        },
      })
    : [];

  const tipperWithLowestBalance = latestAllowances.reduce((acc, allowance) =>
    BigInt(acc.userBalance) < BigInt(allowance.userBalance) ? acc : allowance,
  );

  return {
    // powerUserAllocations,
    // evangelistAllocations: evangelistAllocations
    //   .map((a) => ({
    //     ...a,
    //     hasPowerBadge: neynarData.find((u) => u.fid === a.userId)?.power_badge,
    //   }))
    //   .filter((a) => !a.isInvalidated),
    validTipCount,
    invalidTipCount,
    averageTipAmount: tipAggregations._avg.amount,
    currentTipperLowestBalance: Number(
      BigInt(tipperWithLowestBalance.userBalance) / BigInt(10 ** 18),
    ),
  };
});
