import { LAUNCH_DATE, allocationRatios } from "@farther/common";
import { formatDate } from "@lib/utils";
import React from "react";
import { ExternalLink } from "./ui/ExternalLink";
import { POWER_BADGE_INFO_URL } from "@lib/constants";

export function AirdropInfo() {
  return (
    <ul>
      <li className="mt-3">
        {allocationRatios.POWER_DROPS * 100}% of all Farther tokens are reserved
        for high-quality Farcaster users.
      </li>
      <li className="mt-3">
        Currently, the{" "}
        <ExternalLink href={POWER_BADGE_INFO_URL}>
          Warpcast Power Badge
        </ExternalLink>{" "}
        is used to determine who is high-quality, but this may change in the
        future.
      </li>
      <li className="mt-3">
        Each Farcaster account is only eligible for one airdrop.
      </li>
      <li>
        If you become eligible but lose your power badge before the airdrop, you
        will need to re-earn it to become eligible for the next airdrop.
      </li>
      <li className="mt-3">
        The tokens are being distributed via monthly airdrops over two years
        beginning on{" "}
        {formatDate(LAUNCH_DATE, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
        .
      </li>
      <li>
        The allocation each user receives is determined by:{" "}
        <ol>
          <li>The current airdrop's token supply</li>
          <li>The current number of eligible users</li>
          <li>
            Follower count - half of each airdrop is distributed equally among
            currently eligible users. The other half is allocated based on a
            curve correlating with follower count.
          </li>
        </ol>
      </li>
    </ul>
  );
}
