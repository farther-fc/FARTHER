import { ExternalLink } from "@components/ui/ExternalLink";
import { OPENRANK_ENGAGEMENT_DOCS_URL } from "@lib/constants";

export function TipperScoreInfo() {
  return (
    <div className="text-muted text-sm">
      <p>
        The <span className="text-white">tipper score</span> is an average of
        all tip scores. Tip scores are derived from the percentage change in the
        tip receipient's Farcaster engagement (determined by{" "}
        <ExternalLink href={OPENRANK_ENGAGEMENT_DOCS_URL}>
          OpenRank
        </ExternalLink>
        ) since the time the tip was made. The percentage change of each
        recipient's engagement score is multiplied by the tip amount, then
        scaled up by 100k to be easier to read.
      </p>
      <p>OpenRank data is synced at least once per day.</p>
    </div>
  );
}
