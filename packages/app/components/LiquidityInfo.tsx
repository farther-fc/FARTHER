import { allocationRatios } from "@farther/common";
import React from "react";

export function LiquidityInfo() {
  return (
    <div className="content">
      <h1>Liquidity Rewards</h1>
      <ul className="ml-5">
        <li className="mt-3">
          {allocationRatios.LIQUIDITY_REWARDS * 100}% of the total token supply
          is allocated to liquidity rewards.
        </li>
        <li className="mt-3">
          The first liquidity rewards program will begin for the Uniswap V3
          ETH-FARTHER (0.03%) pool on Base after the first airdrop. It will last
          for six months. Additional rewards programs will follow.
        </li>
      </ul>
    </div>
  );
}
