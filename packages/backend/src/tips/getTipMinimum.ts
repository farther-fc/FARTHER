import { ENVIRONMENT } from "@farther/common";
import { TIP_USD_MINIMUM } from "@farther/common/src/constants";
import { getPrice } from "../utils/getPrice";

export async function getTipMinimumDev(day?: number) {
  if (typeof day !== "number") {
    throw new Error("day argument must be provided as a number.");
  }

  const price = await getPrice(day);

  // $1 worth of FARTHER
  return Math.round(TIP_USD_MINIMUM / price.usd);
}

export async function getTipMinimum(day?: number) {
  if (
    ENVIRONMENT === "development" &&
    !Boolean(process.env.PROD_AGENT_MODELING)
  ) {
    return await getTipMinimumDev(day);
  }

  const price = await getPrice(day);

  // $1 worth of FARTHER
  return calculateTipMinimum(price.usd);
}

export function calculateTipMinimum(usdPrice: number) {
  return TIP_USD_MINIMUM / usdPrice;
}
