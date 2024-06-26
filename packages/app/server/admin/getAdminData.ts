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
      isInvalidated: true,
      tweets: {
        select: {
          id: true,
          reward: true,
          followerCount: true,
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
      baseAmount: true,
      referenceAmount: true,
    },
  });

  const tips = await prisma.tip.findMany({});

  const validTips = tips.filter((t) => !t.invalidTipReason);
  const tipTotal = validTips.reduce((total, tip) => total + tip.amount, 0);
  const invalidTipCount = tips.length - validTips.length;

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
    powerUserAllocations,
    evangelistAllocations: evangelistAllocations
      .map((a) => ({
        ...a,
        hasPowerBadge: neynarData.find((u) => u.fid === a.userId)?.power_badge,
      }))
      .filter((a) => !a.isInvalidated),
    tipCount: validTips.length,
    invalidTipCount,
    tipTotal,
    currentTipperLowestBalance: Number(
      BigInt(tipperWithLowestBalance.userBalance) / BigInt(10 ** 18),
    ),
  };
});
