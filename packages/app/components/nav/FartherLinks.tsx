import { ExternalLink } from "@components/ui/ExternalLink";
import { FARTHER_CHANNEL_URL } from "@lib/constants";

export function FartherChannelLink() {
  return (
    <ExternalLink href={FARTHER_CHANNEL_URL}>Farther channel</ExternalLink>
  );
}

export function FartherAccountLink({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ExternalLink href="https://warpcast.com/farther">{children}</ExternalLink>
  );
}
