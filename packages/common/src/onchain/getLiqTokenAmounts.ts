const Q96 = BigInt(2) ** BigInt(96);

const DECIMALS = 18;

export function getTickAtSqrtPrice(sqrtPriceX96: number) {
  let tick = Math.floor(
    Math.log(Number((BigInt(sqrtPriceX96) / Q96) ** BigInt(2))) /
      Math.log(1.0001),
  );
  return tick;
}

export function getLiqTokenAmounts({
  liquidity,
  sqrtPriceX96,
  tickLow,
  tickHigh,
}: {
  liquidity: number;
  sqrtPriceX96: number;
  tickLow: number;
  tickHigh: number;
}) {
  let sqrtRatioA = Math.sqrt(1.0001 ** tickLow);
  let sqrtRatioB = Math.sqrt(1.0001 ** tickHigh);
  let currentTick = getTickAtSqrtPrice(sqrtPriceX96);
  let sqrtPrice = Number(BigInt(sqrtPriceX96) / Q96);
  let amount0 = 0;
  let amount1 = 0;
  if (currentTick < tickLow) {
    amount0 = Math.floor(
      liquidity * ((sqrtRatioB - sqrtRatioA) / (sqrtRatioA * sqrtRatioB)),
    );
  } else if (currentTick >= tickHigh) {
    amount1 = Math.floor(Number(liquidity * (sqrtRatioB - sqrtRatioA)));
  } else if (currentTick >= tickLow && currentTick < tickHigh) {
    amount0 = Math.floor(
      liquidity * ((sqrtRatioB - sqrtPrice) / (sqrtPrice * sqrtRatioB)),
    );
    amount1 = Math.floor(Number(liquidity * (sqrtPrice - sqrtRatioA)));
  }

  return [amount0, amount1];
}
