import {
  LAUNCH_DATE,
  TOTAL_POWER_USER_AIRDROP_SUPPLY,
  allocationRatios,
} from "@common/constants";
import { formatDate } from "@lib/utils";
import React from "react";
import numeral from "numeral";
import { ExternalLink } from "./ui/ExternalLink";
import { Container } from "@components/ui/Container";

export function AirdropInfo() {
  return (
    <div className="content">
      <ul className="ml-5 list-disc">
        <li className="mt-3">
          {allocationRatios.POWER_DROPS * 100}% (
          {numeral(TOTAL_POWER_USER_AIRDROP_SUPPLY).format("0a")}) of all
          Farther are reserved for active Farcaster users.
        </li>
        <li className="mt-3">
          The tokens are being distributed via eight airdrops over two years
          beginning on {formatDate(LAUNCH_DATE)}.
        </li>
        <li className="mt-3">
          Each Farcaster account is only be eligible for one airdrop.
        </li>
        <li className="mt-3">
          Having a{" "}
          <ExternalLink href={"https://warpcast.com/v/0x0bd49f9c"}>
            Power Badge
          </ExternalLink>{" "}
          is required to ensure users are actively contributing to the network,
          however the criteria is subject to change if it is found that people
          are gaming the algorithm.
        </li>
        <li className="mt-3">
          23% of the total airdrop supply is allocated for the first drop. The
          seven subsequent drops each represent 11% of the total. This
          distribution was chosen based on growth rate and number of Power
          Badges at the time of the first airdrop.
        </li>
      </ul>
    </div>
  );
}
