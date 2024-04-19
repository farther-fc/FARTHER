import {
  _HelperStore,
  Token,
  Pool,
} from "../../../generated/schema";
import { BigDecimal, BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import {
  BIGDECIMAL_ZERO,
  BIGDECIMAL_ONE,
  BIGDECIMAL_TWO,
  INT_ONE,
  INT_ZERO,
  Q192,
  PRECISION,
} from "../constants";
import {
  convertTokenToDecimal,
  exponentToBigInt,
  safeDiv,
} from "../utils/utils";
import { NetworkConfigs } from "../../../configurations/configure";

// Divide numbers too large for floating point or BigDecimal

export function sqrtPriceX96ToTokenPrices(
  sqrtPriceX96: BigInt,
  token0: Token,
  token1: Token
): BigDecimal[] {
  const num = sqrtPriceX96.times(sqrtPriceX96);
  const denom = Q192;
  const price1 = num
    .times(PRECISION)
    .div(denom)
    .times(exponentToBigInt(token0.decimals))
    .div(exponentToBigInt(token1.decimals))
    .toBigDecimal()
    .div(PRECISION.toBigDecimal());

  const price0 = safeDiv(BIGDECIMAL_ONE, price1);

  return [price0, price1];
}

// Tried to return null from here and it did not
function get_token_index(pool: Pool, token: Token): i32 {
  if (pool.inputTokens[0] == token.id) {
    return 0;
  }
  if (pool.inputTokens[1] == token.id) {
    return 1;
  }
  return -1;
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD.
 * If both are, return average of two amounts
 * If neither is, return 0
 * Also, return the value of the valume for each token if it is contained in the whitelist
 */

export function getTrackedVolumeUSD(
  pool: Pool,
  tokens: Token[],
  amountsUSD: BigDecimal[]
): BigDecimal[] {
  // dont count tracked volume on these pairs - usually rebase tokens
  if (NetworkConfigs.getUntrackedPairs().includes(pool.id)) {
    return [BIGDECIMAL_ZERO, BIGDECIMAL_ZERO];
  }

  const poolDeposits = _HelperStore.load(pool.id);
  if (poolDeposits == null) return [BIGDECIMAL_ZERO, BIGDECIMAL_ZERO];

  // if less than 5 LPs, require high minimum reserve amount amount or return 0
  // Updated from original subgraph. Number of deposits may not equal number of liquidity providers
  if (poolDeposits.valueInt < 5) {
    const poolReservesUSD = [
      convertTokenToDecimal(
        pool.inputTokenBalances[INT_ZERO],
        tokens[INT_ZERO].decimals
      ).times(tokens[INT_ZERO].lastPriceUSD!),
      convertTokenToDecimal(
        pool.inputTokenBalances[INT_ONE],
        tokens[INT_ONE].decimals
      ).times(tokens[INT_ONE].lastPriceUSD!),
    ];
    if (
      NetworkConfigs.getWhitelistTokens().includes(tokens[INT_ZERO].id) &&
      NetworkConfigs.getWhitelistTokens().includes(tokens[INT_ONE].id)
    ) {
      if (
        poolReservesUSD[INT_ZERO].plus(poolReservesUSD[INT_ONE]).lt(
          NetworkConfigs.getMinimumLiquidityThreshold()
        )
      ) {
        return [BIGDECIMAL_ZERO, BIGDECIMAL_ZERO];
      }
    }
    if (
      NetworkConfigs.getWhitelistTokens().includes(tokens[INT_ZERO].id) &&
      !NetworkConfigs.getWhitelistTokens().includes(tokens[INT_ONE].id)
    ) {
      if (
        poolReservesUSD[INT_ZERO].times(BIGDECIMAL_TWO).lt(
          NetworkConfigs.getMinimumLiquidityThreshold()
        )
      ) {
        return [BIGDECIMAL_ZERO, BIGDECIMAL_ZERO];
      }
    }
    if (
      !NetworkConfigs.getWhitelistTokens().includes(tokens[INT_ZERO].id) &&
      NetworkConfigs.getWhitelistTokens().includes(tokens[INT_ONE].id)
    ) {
      if (
        poolReservesUSD[INT_ONE].times(BIGDECIMAL_TWO).lt(
          NetworkConfigs.getMinimumLiquidityThreshold()
        )
      ) {
        return [BIGDECIMAL_ZERO, BIGDECIMAL_ZERO];
      }
    }
  }

  // both are whitelist tokens, return sum of both amounts
  if (
    NetworkConfigs.getWhitelistTokens().includes(tokens[INT_ZERO].id) &&
    NetworkConfigs.getWhitelistTokens().includes(tokens[INT_ONE].id)
  ) {
    return [amountsUSD[INT_ZERO], amountsUSD[INT_ONE]];
  }

  // take double value of the whitelisted token amount
  if (
    NetworkConfigs.getWhitelistTokens().includes(tokens[INT_ZERO].id) &&
    !NetworkConfigs.getWhitelistTokens().includes(tokens[INT_ONE].id)
  ) {
    return [amountsUSD[INT_ZERO], amountsUSD[INT_ZERO]];
  }

  // take double value of the whitelisted token amount
  if (
    !NetworkConfigs.getWhitelistTokens().includes(tokens[INT_ZERO].id) &&
    NetworkConfigs.getWhitelistTokens().includes(tokens[INT_ONE].id)
  ) {
    return [amountsUSD[INT_ONE], amountsUSD[INT_ONE]];
  }

  // neither token is on white list, tracked amount is 0
  return [BIGDECIMAL_ZERO, BIGDECIMAL_ZERO];
}
