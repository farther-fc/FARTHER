import { ExternalLink } from "@components/ui/ExternalLink";
import { OPENRANK_DOCS_URL } from "@lib/constants";

export function TipperScoreInfo() {
  return (
    <div className="text-muted text-sm">
      <p>
        Each tipper's rank is based on their{" "}
        <span className="text-white">tipper score</span>, which is an sum of all
        tip scores. Tip scores are derived from the percentage change in the tip
        receipient's Farcaster engagement (determined by{" "}
        <ExternalLink href={OPENRANK_DOCS_URL}>OpenRank</ExternalLink>) since
        the time the tip was made until the end of the month. The percentage
        change of each recipient's engagement score is multiplied by the tip
        amount.
      </p>
      <p>OpenRank data is synced at least once per day.</p>
    </div>
  );
}
