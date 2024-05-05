import { EvangelistRules } from "@components/EvangelistRules";
import { NoUserFoundCard } from "@components/NoUserFoundCard";
import { TweetRewardTable } from "@components/TweetRewardTable";
import { Button } from "@components/ui/Button";
import { Container } from "@components/ui/Container";
import { ExternalLink } from "@components/ui/ExternalLink";
import { TWEET_FARTHER_BONUS_SCALER } from "@farther/common";
import { ROUTES, clickIds } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function EvangelizePage() {
  const { account, user, userIsLoading } = useUser();
  const { openConnectModal } = useConnectModal();

  const isNotOnFarcaster = account.address && !user && !userIsLoading;

  const DEFAULT_TWEET_LINK = `https://twitter.com/intent/tweet?text=Farcaster%20is%20pushing%20social%20media%20$farther%E2%9C%A8%0A%0AFID${user?.fid}`;

  return (
    <Container variant="page">
      <div className="content">
        <h1>Evangelize</h1>
        {isNotOnFarcaster && <NoUserFoundCard />}
        <p>
          Farcaster users can earn Farther tokens by evangelizing Farcaster on
          legacy social media platforms. The rewards scale based on the number
          of followers of the evangelizing account. Currently only X (Twitter)
          is supported but more will follow.
        </p>

        <h2>Reward</h2>
        <p>Use this table to calculate your expected reward.</p>
        <TweetRewardTable />
        <h2>Steps</h2>
        <ol>
          {!account.address && (
            <li>
              <Button
                sentryId={clickIds.evangelizePageConnectWallet}
                variant="link"
                onClick={openConnectModal}
              >
                Connect your wallet
              </Button>{" "}
            </li>
          )}
          <li>
            {user?.fid ? (
              <ExternalLink href={DEFAULT_TWEET_LINK}>
                Post a tweet
              </ExternalLink>
            ) : (
              "Post a tweet"
            )}{" "}
            that includes:{" "}
            <ul>
              <li>
                <strong>"Farcaster"</strong>
              </li>
              <li>
                <strong>
                  "FID
                  {user?.fid ?? "<Farcaster ID>"}"
                </strong>{" "}
                {user?.fid && "- This is your unique Farcaster ID"}
              </li>
              <li>
                <strong>"$FARTHER✨"</strong> for{" "}
                {TWEET_FARTHER_BONUS_SCALER * 100 - 100}% bonus
              </li>
            </ul>
          </li>
          <li>
            Copy the tweet's URL and{" "}
            <Link href={`${ROUTES.evangelize.path}/submit-tweet`}>
              submit it here
            </Link>
            .
          </li>
          <li>
            If you meet all the conditions below, your reward points will become
            redeemable as Farther tokens on the{" "}
            <Link href={ROUTES.rewards.path}>rewards page</Link> at the end of
            the month.
          </li>
        </ol>
        <h2 id="conditions">Conditions</h2>
        <EvangelistRules />
      </div>
    </Container>
  );
}

export function getStaticProps() {
  return {
    props: {
      seo: {
        title: "Evangelize",
      },
    },
  };
}
