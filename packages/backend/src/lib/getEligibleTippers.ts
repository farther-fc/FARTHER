import {
  TIPPER_OPENRANK_THRESHOLD_REQUIREMENT,
  TIPPER_REQUIRED_FARTHER_BALANCE,
  WAD_SCALER,
  getOpenRankScores,
  isBanned,
} from "@farther/common";
import Decimal from "decimal.js";
import { prisma } from "../prisma";
import { getHolders } from "./getHolders";

export async function getEligibleTippers() {
  const latestTipMeta = await prisma.tipMeta.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
    include: {
      allowances: true,
    },
  });

  const previousDistributionTime = latestTipMeta
    ? latestTipMeta.createdAt
    : new Date(0);

  const allHolders = await getHolders({ includeLPs: true });

  const eligibleHolders = allHolders.filter((holder) => {
    const isHolderBanned = isBanned(holder.fid);

    if (isHolderBanned) {
      console.warn(`FID ${holder.fid} is banned`);
    }

    return (
      new Decimal(holder.totalBalance.toString()).gte(
        new Decimal(TIPPER_REQUIRED_FARTHER_BALANCE).mul(WAD_SCALER.toString()),
      ) && !isHolderBanned
    );
  });

  const eligibleFidsBasedOnOpenRank = (
    await getOpenRankScores({
      fids: eligibleHolders.map((eh) => eh.fid),
      type: "FOLLOWING",
      rateLimit: 10,
    })
  )
    .filter((score) =>
      // TODO: remove ID check after the 8/8/2024 cycle begins
      latestTipMeta?.id !== "360c5838-e21a-497e-848c-8f9d9d0ca067"
        ? score.rank < TIPPER_OPENRANK_THRESHOLD_REQUIREMENT
        : true,
    )
    .map((score) => score.fid);

  const filteredHolders = eligibleHolders.filter((holder) =>
    eligibleFidsBasedOnOpenRank.includes(holder.fid),
  );

  const existingHolders = await prisma.user.findMany({
    where: {
      id: {
        in: filteredHolders.map((eh) => eh.fid),
      },
    },
    include: tipperInclude(previousDistributionTime),
  });

  const existingHolderFids = existingHolders.map((eh) => eh.id);

  const newHolderFids = filteredHolders.filter(
    (eh) => !existingHolderFids.includes(eh.fid),
  );

  const newHolders = await prisma.$transaction(
    newHolderFids.map((user) =>
      prisma.user.create({
        data: {
          id: user.fid,
        },
        include: tipperInclude(previousDistributionTime),
      }),
    ),
  );

  return [...existingHolders, ...newHolders].map((holder) => {
    const foundHolder = filteredHolders.find((eh) => eh.fid === holder.id);
    // This is mainly to silence typescript
    if (!foundHolder) {
      throw new Error(`Holder ${holder.id} not found in filteredHolders`);
    }
    return {
      ...holder,
      totalBalance: foundHolder.totalBalance,
    };
  });
}

export async function getExistingTippers() {
  const prevTipMeta = await prisma.tipMeta.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  const previousDistributionTime = prevTipMeta
    ? prevTipMeta.createdAt
    : new Date(0);

  return prisma.user.findMany({
    where: {
      tipAllowances: {
        // Will return users that have at least one tip allowance
        some: {},
      },
    },
    include: tipperInclude(previousDistributionTime),
  });
}

export function tipperInclude(previousDistributionTime: Date) {
  return {
    tipAllowances: {
      include: {
        tips: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    },
    tipsGiven: {
      where: {
        createdAt: {
          gte: previousDistributionTime,
        },
        invalidTipReason: null,
      },
      include: {
        tippee: {
          select: {
            tipAllowances: {
              where: {
                createdAt: {
                  gte: previousDistributionTime,
                },
              },
            },
          },
        },
      },
    },
  } as const;
}
