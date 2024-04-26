import { ExternalLink } from "@components/ui/ExternalLink";
import { POINTS_EXPIRATION_MONTHS } from "@farther/common";
import { POWER_BADGE_INFO_URL } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import React from "react";

export function EvangelistRules() {
  const { user } = useUser();

  return (
    <div>
      <ul>
        <li>
          The tweet must contain "Farcaster", and "FID
          {user?.fid ?? "<Farcaster ID>"}". Capitalization doesn't matter.
        </li>
        <li>If you delete the tweet, your points become invalid.</li>
        <li>Rewards can only be requested once every three days.</li>
        <li>
          Any Farcaster user can earn points, but they don't become claimable as
          $FARTHER tokens unless the user has a{" "}
          <ExternalLink href={POWER_BADGE_INFO_URL}>
            Warpcast Power Badge
          </ExternalLink>
          .
        </li>
        <li>
          Points expire if they don't become claimable within{" "}
          {POINTS_EXPIRATION_MONTHS} months.
        </li>
        <li>
          The Farther team reserves the right to reject submissions from
          accounts attempting to game the system by using Twitter accounts with
          many fake followers.
        </li>
      </ul>
    </div>
  );
}
