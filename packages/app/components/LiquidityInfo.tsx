import {
  LAUNCH_DATE,
  TOTAL_TOKEN_SUPPLY,
  allocationRatios,
} from "@common/constants";
import { formatDate } from "@lib/utils";
import React from "react";
import numeral from "numeral";
import { Container } from "@components/ui/Container";

export function LiquidityInfo() {
  return (
    <div className="content">
      <h1>Liquidity Rewards</h1>
      <ul className="ml-5 list-disc">
        <li className="mt-3">
          After the first airdrop ({formatDate(LAUNCH_DATE)}), an onchain
          liquidity rewards program will begin for the 0.03% Uniswap V3
          ETH-FARTHER pool on Base. It will last for one year.
        </li>
        <li className="mt-3">
          {allocationRatios.UNI_LP_REWARDS * 100}% (
          {numeral(TOTAL_TOKEN_SUPPLY * allocationRatios.UNI_LP_REWARDS).format(
            "0a",
          )}
          ) of the total supply will be allocated to a rewards program for the
          liquidity providers in the UniswapV3 0.03% pool who lock up their LP
          tokens. This will last 6 months.
        </li>
        <li className="mt-3">
          An additional {allocationRatios.LP_BACKSTOP * 100}% will be used to
          help bootstrap the pool and fund future liquidity incentive programs.
        </li>
      </ul>
    </div>
  );
}
