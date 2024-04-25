import { InfoCard } from "@components/InfoCard";
import { FartherChannelLink } from "@components/nav/FartherChannelLink";
import React from "react";

export function NoUserFoundCard() {
  return (
    <InfoCard variant="muted">
      A Farcaster user associated with your connected address wasn't found.
      Please double check you have added it as a verified address in your
      Warpcast settings. If you believe this is an error, please reach out for
      help in the <FartherChannelLink />
    </InfoCard>
  );
}
