import {
  ENVIRONMENT,
  TIPS_DURATION_DAYS,
  tokenAllocations,
} from "@farther/common";

export function dailyTipDistribution({
  totalDays = TIPS_DURATION_DAYS,
  totalAmount = ENVIRONMENT === "development" &&
  !Boolean(process.env.PROD_AGENT_MODELING)
    ? 10_000_000
    : tokenAllocations.tips,
  currentDay,
  staticRatio = 0.5,
}: {
  totalDays?: number;
  totalAmount?: number;
  currentDay: number;
  staticRatio?: number;
}) {
  if (currentDay < 0 || currentDay > totalDays) {
    throw new Error("Current day must be within the range of total days");
  }

  const totalDynamicAmount = totalAmount * (1 - staticRatio);
  const baseAmountPerDay = staticRatio
    ? (totalAmount * staticRatio) / totalDays
    : 0;

  // Calculate the normalization factor for exponential decay
  const decayFactor = Math.exp(-Math.log(4) / totalDays);
  let normalizationFactor = 0;

  for (let i = 0; i < totalDays; i++) {
    normalizationFactor += Math.pow(decayFactor, i);
  }

  const dynamicAmountToday =
    (totalDynamicAmount / normalizationFactor) *
    Math.pow(decayFactor, currentDay);

  return dynamicAmountToday + baseAmountPerDay;
}
