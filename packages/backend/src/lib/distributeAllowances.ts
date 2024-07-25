import {
  DAILY_USD_TOTAL_ALLOWANCE,
  DistributeAllowancesError,
  ENVIRONMENT,
  cacheTypes,
  getHoursAgo,
  isProduction,
} from "@farther/common";
import dayjs from "dayjs";
import { prisma } from "../prisma";
import { getEligibleTippers, getExistingTippers } from "./getEligibleTippers";
import { flushCache } from "./utils/flushCache";
import { getPrice } from "./utils/getPrice";

const fartherV2LaunchDate = dayjs("2024-08-01T00:00:00.000Z");

export async function distributeAllowances() {
  const tipsMetas = await getTipMetas();

  const previousMeta = tipsMetas[0];

  // Using dayjs, verify that the previous distribution was over 23 hours ago
  if (isProduction) {
    const hoursSinceLastDistribution = getHoursAgo(previousMeta.createdAt);

    if (hoursSinceLastDistribution < 23) {
      throw new DistributeAllowancesError({
        message: `Last distribution was less than 23 hours ago`,
      });
    }
  }

  const fartherUsdPrice = await getPrice();

  const baseTotalAllowance = DAILY_USD_TOTAL_ALLOWANCE / fartherUsdPrice;

  // Get existing tippers to calculate the total unused allowance from the previous day
  const existingTippers = await getExistingTippers();

  const prevUnusedAllowance =
    Date.now() > fartherV2LaunchDate.add(1, "day").valueOf()
      ? existingTippers.reduce((allTippersTotalSpent, user) => {
          const tipperSpent = user.tipAllowances[0].tips
            .filter((t) => !t.invalidTipReason)
            .reduce((spent, tip) => tip.amount + spent, 0);

          return (
            user.tipAllowances[0].amount - tipperSpent + allTippersTotalSpent
          );
        }, 0)
      : 0;

  const availableTotalAllowance = baseTotalAllowance + prevUnusedAllowance;

  // Eligible tippers for new tip cycle
  const eligibleTippers = await getEligibleTippers();

  if (process.env.NODE_ENV === "development" || ENVIRONMENT === "development") {
    printDevLogs({
      previousMeta,
      eligibleTippers,
      prevUnusedAllowance,
      availableTotalAllowance,
      fartherUsdPrice,
    });
  }

  await prisma.$transaction(async (tx) => {
    const tipMeta = await tx.tipMeta.create({
      data: {
        tipMinimum: 0,
        totalAllowance: availableTotalAllowance,
        carriedOver: prevUnusedAllowance,
        usdPrice: fartherUsdPrice,
      },
    });

    const allowancePerTipper = Math.floor(
      availableTotalAllowance / eligibleTippers.length,
    );

    // Distribute
    const newAllowances = eligibleTippers.map((tipper, i) => {
      return {
        userId: tipper.id,
        tipMetaId: tipMeta.id,
        amount: allowancePerTipper,
        userBalance: tipper.totalBalance.toString(),
      };
    });

    await tx.tipAllowance.createMany({
      data: newAllowances,
    });
  });

  await Promise.all([
    flushCache({ type: cacheTypes.LEADERBOARD }),
    flushCache({ type: cacheTypes.TIP_META }),
  ]);

  console.info(
    `Allowances distributed: ${availableTotalAllowance.toLocaleString()} to ${eligibleTippers.length.toLocaleString()} tippers`,
  );
}

async function getTipMetas() {
  return await prisma.tipMeta.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      allowances: {
        select: {
          id: true,
          amount: true,
        },
      },
    },
  });
}

function printDevLogs({
  previousMeta,
  eligibleTippers,
  prevUnusedAllowance,
  availableTotalAllowance,
  fartherUsdPrice,
}: {
  previousMeta: Awaited<ReturnType<typeof getTipMetas>>[0];
  eligibleTippers: Awaited<ReturnType<typeof getEligibleTippers>>;
  prevUnusedAllowance: number;
  availableTotalAllowance: number;
  fartherUsdPrice: number;
}) {
  if (previousMeta) {
    console.info("Previous tip min:", previousMeta.tipMinimum.toLocaleString());
    console.info(
      "Previous total allowance:",
      previousMeta.totalAllowance.toLocaleString(),
    );
  }

  console.info(`Eligible tippers: ${eligibleTippers.length}`);
  console.info(`Previous unused allowance: ${prevUnusedAllowance}`);
  console.info(
    "Available total allowance:",
    availableTotalAllowance.toLocaleString(),
  );

  console.info(`Current price: $${fartherUsdPrice}`);
}
