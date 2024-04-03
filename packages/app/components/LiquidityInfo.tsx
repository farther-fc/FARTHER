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
          {allocationRatios.LP_REWARDS * 100}% (
          {numeral(TOTAL_TOKEN_SUPPLY * allocationRatios.LP_REWARDS).format(
            "0a",
          )}
          ) of the total supply will be split between an initial liquidity pool
          and liquidity rewards.
        </li>
        <li className="mt-3">
          Liquidity providers must lock up their LP tokens to receive rewards.
        </li>
      </ul>
    </div>
  );
}
