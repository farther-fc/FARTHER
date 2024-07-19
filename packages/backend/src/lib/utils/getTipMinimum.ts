import { TIP_USD_MINIMUM } from "@farther/common";
import { getPrice } from "./getPrice";

export async function getTipMinimum() {
  const fatherUsdPrice = await getPrice();

  // $1 worth of FARTHER
  return TIP_USD_MINIMUM / fatherUsdPrice;
}
