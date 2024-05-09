import { InfoCard } from "@components/InfoCard";
import { FartherAccountLink } from "@components/nav/FartherLinks";

export function NoUserFoundCard() {
  return (
    <InfoCard variant="ghost">
      A Farcaster user associated with your connected address wasn't found.
      Please double check you have added it as a verified address in your
      Warpcast settings. If you believe this is an error, please{" "}
      <FartherAccountLink>reach out for help</FartherAccountLink>.
    </InfoCard>
  );
}
