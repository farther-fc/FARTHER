import { prisma } from "@farther/backend";
import {
  ADDITIONAL_TIPPERS_INCREMENT,
  INITIAL_ELIGIBLE_TIPPERS,
  REQUIRED_DOLLAR_VALUE_PER_TIPPER,
} from "@farther/common";
import { getHolders } from "server/token/getHolders";
import { getPrice } from "../../token/getPrice";

export async function getEligibleTippers({
  currentDay,
  availableTokens,
}: {
  currentDay: number;
  availableTokens: number;
}) {
  const prevTipMeta = await prisma.tipMeta.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
    include: {
      allowances: true,
    },
  });

  const previousDistributionTime = prevTipMeta
    ? prevTipMeta.createdAt
    : new Date(0);

  const eligibleHolders = await getEligibleHolders({
    latestTipperCount: prevTipMeta
      ? prevTipMeta.allowances.length
      : INITIAL_ELIGIBLE_TIPPERS,
    availableTokens,
    currentDay,
  });

  const existingHolders = await prisma.user.findMany({
    where: {
      id: {
        in: eligibleHolders.map((eh) => eh.fid),
      },
    },
    include: tipperInclude(previousDistributionTime),
  });

  const existingHolderFids = existingHolders.map((eh) => eh.id);

  const newHolderFids = eligibleHolders.filter(
    (eh) => !existingHolderFids.includes(eh.fid),
  );

  const newHolders = await prisma.$transaction(
    newHolderFids.map((user, i) =>
      prisma.user.create({
        data: {
          id: user.fid,
        },
        include: tipperInclude(previousDistributionTime),
      }),
    ),
  );

  return [...existingHolders, ...newHolders].map((holder) => {
    const foundHolder = eligibleHolders.find((eh) => eh.fid === holder.id);
    // This is mainly to silence typescript
    if (!foundHolder) {
      throw new Error(`Holder ${holder.id} not found in eligibleHolders`);
    }
    return {
      ...holder,
      totalBalance: foundHolder.totalBalance.toString(),
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

function tipperInclude(previousDistributionTime: Date) {
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
    },
  } as const;
}

/**
 *
 * Ensures that the number of eligible tippers is only incremented if the USD
 * value of the available tokens is enough to give each tipper enough to make it interesting.
 */
async function getEligibleHolders({
  latestTipperCount,
  availableTokens,
  currentDay,
}: {
  latestTipperCount: number;
  availableTokens: number;
  currentDay: number;
}) {
  const holders = await getHolders({ includeLPs: true });
  const price = await getPrice(currentDay);
  const usdValueOfTokens = availableTokens * price.usd;
  const tokensPerTipperRequirement =
    REQUIRED_DOLLAR_VALUE_PER_TIPPER / price.usd;

  console.info(`availableTokens: ${availableTokens.toLocaleString()}`);
  console.info(
    `Tokens per tipper requirement: ${tokensPerTipperRequirement.toLocaleString()}`,
  );
  console.info(`USD value of tokens: ${usdValueOfTokens.toLocaleString()}`);
  console.info(
    `Required USD value to add more tippers: ${(
      tokensPerTipperRequirement *
      price.usd *
      (latestTipperCount + ADDITIONAL_TIPPERS_INCREMENT)
    ).toLocaleString()}`,
  );

  // If it's the first day or the USD value of the available tokens isn't
  // enough to make it interesting for the next increment of tippers, return
  // the current tipper count. Otherwise, return the current tipper count plus the increment.
  if (
    currentDay === 1 ||
    price.usd *
      tokensPerTipperRequirement *
      (latestTipperCount + ADDITIONAL_TIPPERS_INCREMENT) >
      usdValueOfTokens
  ) {
    return holders.slice(0, latestTipperCount);
  }
  return holders.slice(0, latestTipperCount + ADDITIONAL_TIPPERS_INCREMENT);
}
