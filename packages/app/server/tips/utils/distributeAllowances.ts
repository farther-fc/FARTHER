import { prisma } from "@farther/backend";
import { ENVIRONMENT } from "@farther/common";
import { scaleLinear } from "d3";
import { DistributeAllowancesError } from "../../errors";
import { constrainWeights } from "../../tips/utils/constrainWeights";
import { getTipMinimum } from "../../tips/utils/getTipMinimum";
import { getUniqueTippees } from "../../tips/utils/getUniqueTippees";
import { flushLeaderboardCache } from "../../tips/utils/tipsLeaderboard";
import { getPrice } from "../../token/getPrice";
import { dailyTipDistribution } from "./dailyTipDistribution";
import { getEligibleTippers, getExistingTippers } from "./getEligibleTippers";

// Recovery threshold is a multiplier of the previous tip minimum.
// When the tipper's allowance is at or below the recovery threshold, they receive a boost
// to the weight determining their daily allowance relative to the total.
const RECOVERY_THRESHOLD = 10;
const MAX_RECOVERY_ADJUSTMENT_FACTOR = 25;

export async function distributeAllowances() {
  const tipsMetas = await getTipMetas();

  const currentDay = tipsMetas.length + 1;

  const previousMeta = tipsMetas[0];

  const defaultTotal = dailyTipDistribution({ currentDay });

  // Get existing tippers to calculate the total unused allowance from the previous day
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

  // Eligible tippers for new tip cycle
  const eligibleTippers = await getEligibleTippers();

  const tipMinimum = Math.round(await getTipMinimum(currentDay));

  const weights = getWeights({
    previousMeta,
    eligibleTippers,
    availableTotalAllowance,
  });

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  const combinedTipMinimums = tipMinimum * eligibleTippers.length;

  if (combinedTipMinimums > availableTotalAllowance) {
    throw new DistributeAllowancesError({
      message: `Combined tip minimums exceeds total daily allowance`,
    });
  }

  // Subtract tip min from total daily allowance (since min is automatically given to everyone)
  const allowanceRemainder = availableTotalAllowance - combinedTipMinimums;

  const { usd } = await getPrice(currentDay);
  const fartherUsdPrice = usd;

  if (process.env.NODE_ENV === "development" || ENVIRONMENT === "development") {
    printDevLogs({
      currentDay,
      previousMeta,
      eligibleTippers,
      prevUnusedAllowance,
      availableTotalAllowance,
      tipMinimum,
      weights,
      totalWeight,
      allowanceRemainder,
      fartherUsdPrice,
    });
  }

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
        tipMinimum + (weights[i] / totalWeight) * allowanceRemainder,
      );

      return {
        userId: tipper.id,
        tipMetaId: tipMeta.id,
        amount,
        userBalance: tipper.totalBalance.toString(),
      };
    });

    await tx.tipAllowance.createMany({
      data: newAllowances,
    });
  });

  await flushLeaderboardCache();
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

function getWeights({
  previousMeta,
  eligibleTippers,
  availableTotalAllowance,
}: {
  previousMeta: Awaited<ReturnType<typeof getTipMetas>>[0];
  eligibleTippers: Awaited<ReturnType<typeof getEligibleTippers>>;
  availableTotalAllowance: number;
}) {
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

  const weights = eligibleTippers.map((tipper) => {
    let weight: number;

    // New tippers don't have an allowance yet
    if (!tipper.tipAllowances[0]) {
      weight = previousMeta
        ? (meanAllowance / prevTotalAllowanceMinusTipMinimums) * 0.75
        : 1;
    } else {
      const prevAllowance = tipper.tipAllowances[0].amount;

      const uniqueTippees = getUniqueTippees(tipper.tipsGiven);

      const prevAllowanceMinusTipMinimum = prevAllowance - previousTipMin;
      const recoveryAdjustment = getRecoveryAdjustment(prevAllowance);

      const prevWeight =
        prevAllowanceMinusTipMinimum / prevTotalAllowanceMinusTipMinimums;

      const uniqueTippeeAdjustment = getUniqueTippeeAdjustment({
        meanAllowance,
        prevAllowance,
        uniqueTippees,
      });

      weight =
        uniqueTippees > 0
          ? prevWeight * uniqueTippeeAdjustment * (1 + recoveryAdjustment)
          : prevWeight;
    }

    return weight;
  });

  return constrainWeights({ weights, breadth: 0.6 });
}

const TIPPEE_ADJUSTMENT_FACTOR = 0.002;

function getUniqueTippeeAdjustment({
  meanAllowance,
  prevAllowance,
  uniqueTippees,
}: {
  meanAllowance: number;
  prevAllowance: number;
  uniqueTippees: number;
}) {
  // The unqiue tippee adjustment is dampened for tipper allowances that are higher than the mean allowance
  const allowanceDampenerFn = scaleLinear()
    .domain([meanAllowance, meanAllowance * 4])
    .range([1, 0])
    .clamp(true);
  const allowanceDampener = allowanceDampenerFn(prevAllowance);

  return uniqueTippees > 0
    ? 1 + uniqueTippees * TIPPEE_ADJUSTMENT_FACTOR * allowanceDampener
    : 1;
}

const TIPPER_IDS = {
  acai: 246871,
  wahoo: 3741,
  kylepatrick: 247143,
  bunglon: 502822,
  matsuda: 334811,
  marcelonada: 330083,
  reneecampbell: 283144,
};

const TIPPER_NAMES = {
  246871: "acai",
  3741: "wahoo",
  247143: "kylepatrick",
  502822: "bunglon",
  334811: "matsuda",
  330083: "mercelonada",
  283144: "reneecampbell",
};

type TipperNameKey = keyof typeof TIPPER_NAMES;

function printDevLogs({
  currentDay,
  previousMeta,
  eligibleTippers,
  prevUnusedAllowance,
  availableTotalAllowance,
  tipMinimum,
  weights,
  totalWeight,
  allowanceRemainder,
  fartherUsdPrice,
}: {
  currentDay: number;
  previousMeta: Awaited<ReturnType<typeof getTipMetas>>[0];
  eligibleTippers: Awaited<ReturnType<typeof getEligibleTippers>>;
  prevUnusedAllowance: number;
  availableTotalAllowance: number;
  tipMinimum: number;
  weights: number[];
  totalWeight: number;
  allowanceRemainder: number;
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
    "Tip minimum:",
    tipMinimum,
  );

  console.info(`Current price: $${fartherUsdPrice}`);

  let allowanceTotal = 0;
  // FOR TESTING PURPOSES
  eligibleTippers.forEach((tipper, i) => {
    const amount = Math.floor(
      tipMinimum + (weights[i] / totalWeight) * allowanceRemainder,
    );

    allowanceTotal += amount;

    if (Object.values(TIPPER_IDS).includes(tipper.id) || amount > 1000) {
      console.log({
        id: TIPPER_NAMES[tipper.id as TipperNameKey] || tipper.id,
        amount,
        // userBalance: tipper.totalBalance.toString(),
      });
    }
  });

  console.info("Total allowance:", allowanceTotal.toLocaleString());
}
