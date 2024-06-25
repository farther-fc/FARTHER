import { prisma } from "@farther/backend";
import { scaleLinear } from "d3";
import { DistributeAllowancesError } from "../../../server/errors";
import { flushLeaderboardCache } from "../../../server/tips/tipsLeaderboard";
import { getTipMinimum } from "../../../server/tips/utils/getTipMinimum";
import { getUniqueTippees } from "../../../server/tips/utils/getUniqueTippees";
import { getPrice } from "../../../server/token/getPrice";
import { dailyTipDistribution } from "./dailyTipDistribution";
import { getEligibleTippers, getExistingTippers } from "./getEligibleTippers";

const STATIC_ADJUSTMENT_FACTOR = 0.002;

// Recovery threshold is a multiplier of the previous tip minimum.
// When the tipper's allowance is at or below the recovery threshold, they receive a boost
// to the weight determining their daily allowance relative to the total.
const RECOVERY_THRESHOLD = 10;
const MAX_RECOVERY_ADJUSTMENT_FACTOR = 25;

export async function distributeAllowances() {
  const tipsMetas = await prisma.tipMeta.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
    include: {
      allowances: {
        select: {
          id: true,
          amount: true,
        },
      },
    },
  });

  const currentDay = tipsMetas.length + 1;

  const previousMeta = tipsMetas[0];

  const defaultTotal = dailyTipDistribution({ currentDay });

  const existingTippers = await getExistingTippers();

  const prevUnusedAllowance = existingTippers.reduce(
    (allTippersTotalSpent, user) => {
      const tipperSpent = user.tipAllowances[0].tips
        .filter((t) => !t.invalidTipReason)
        .reduce((spent, tip) => tip.amount + spent, 0);

      return user.tipAllowances[0].amount - tipperSpent + allTippersTotalSpent;
    },
    0,
  );

  const availableTotalAllowance = defaultTotal + prevUnusedAllowance;

  const eligibleTippers = await getEligibleTippers();

  const tipMinimum = Math.round(await getTipMinimum(currentDay));

  const { usd } = await getPrice(currentDay);
  const fartherUsdPrice = usd;

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
    "Tip minimum:",
    tipMinimum,
  );

  console.info(`Current price: $${fartherUsdPrice}`);

  let totalWeight = 0;

  const previousTipMin = previousMeta ? previousMeta.tipMinimum : 0;
  const prevTotalAllowanceMinusTipMinimums = !previousMeta
    ? 0
    : previousMeta.totalAllowance -
      previousTipMin * previousMeta.allowances.length;
  const meanAllowance = previousMeta
    ? prevTotalAllowanceMinusTipMinimums / previousMeta.allowances.length
    : availableTotalAllowance / eligibleTippers.length;

  const getRecoveryAdjustment = scaleLinear()
    .domain([previousTipMin, previousTipMin * RECOVERY_THRESHOLD])
    .range([MAX_RECOVERY_ADJUSTMENT_FACTOR, 0])
    .clamp(true);

  const currentWeights = eligibleTippers.map((tipper) => {
    let prevWeight: number;
    let weight: number;

    // New tippers don't have an allowance yet
    if (!tipper.tipAllowances[0]) {
      prevWeight = 0;
      weight = previousMeta
        ? meanAllowance / prevTotalAllowanceMinusTipMinimums
        : 1;
    } else {
      const prevAllowance = tipper.tipAllowances[0].amount;

      const uniqueTippees = getUniqueTippees(tipper.tipsGiven);

      const prevAllowanceMinusTipMinimum = prevAllowance - previousTipMin;
      const recoveryAdjustment = getRecoveryAdjustment(prevAllowance);

      prevWeight =
        prevAllowanceMinusTipMinimum / prevTotalAllowanceMinusTipMinimums;
      weight =
        uniqueTippees > 0
          ? prevWeight *
            (1 + STATIC_ADJUSTMENT_FACTOR * uniqueTippees) *
            (1 + recoveryAdjustment)
          : prevWeight;
    }

    totalWeight += weight;

    return weight;
  });

  const combinedTipMinimums = tipMinimum * eligibleTippers.length;

  if (combinedTipMinimums > availableTotalAllowance) {
    throw new DistributeAllowancesError({
      message: `Combined tip minimums exceeds total daily allowance`,
    });
  }

  // Subtract tip min from total daily allowance (since min is automatically given to everyone)
  const allowanceRemainder = availableTotalAllowance - combinedTipMinimums;

  await prisma.$transaction(async (tx) => {
    const tipMeta = await tx.tipMeta.create({
      data: {
        tipMinimum,
        totalAllowance: availableTotalAllowance,
        carriedOver: prevUnusedAllowance,
        usdPrice: fartherUsdPrice,
      },
    });

    // Distribute
    const newAllowances = eligibleTippers.map((tipper, i) => {
      const amount = Math.floor(
        tipMinimum + (currentWeights[i] / totalWeight) * allowanceRemainder,
      );

      return {
        userId: tipper.id,
        tipMetaId: tipMeta.id,
        amount,
        userBalance: tipper.totalBalance,
      };
    });

    await tx.tipAllowance.createMany({
      data: newAllowances,
    });
  });

  await flushLeaderboardCache();
}
