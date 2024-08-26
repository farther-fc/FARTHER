import { EndStatement } from "@components/EndStatement";
import { InfoCard } from "@components/InfoCard";
import TipRewardsHeader from "@components/TipRewardsHeader";
import { TipsUserInfo } from "@components/tips/TipsUserInfo";
import { Button } from "@components/ui/Button";
import { Container } from "@components/ui/Container";
import { ExternalLink } from "@components/ui/ExternalLink";
import { Skeleton } from "@components/ui/Skeleton";
import {
  ACTIVE_TIP_DAYS_REQUIRED,
  BREADTH_RATIO_TIP_COUNT_THRESHOLD,
  DAILY_USD_TOTAL_ALLOWANCE,
  TIPPEE_FOLLOWERS_MIN,
  TIPPER_OPENRANK_THRESHOLD_REQUIREMENT,
  TIPPER_REQUIRED_FARTHER_BALANCE,
} from "@farther/common";
import { OPENRANK_DOCS_URL } from "@lib/constants";
import { routes } from "@lib/routes";
import { useTipsMeta } from "hooks/useTipsMeta";
import Link from "next/link";
import numeral from "numeral";

function TipsPage() {
  const { tipMinimum, createdAt, tipsMetaLoading, eligibleTippers } =
    useTipsMeta();

  return (
    <Container variant="page">
      <main className="content">
        <h1>Tips</h1>
        <TipRewardsHeader />
        <h4 className="text-ghost mt-8 text-sm uppercase">Current Cycle</h4>
        {!tipsMetaLoading && createdAt ? (
          <InfoCard className="mt-0">
            <EndStatement />
          </InfoCard>
        ) : (
          <Skeleton />
        )}
        <div className="grid gap-x-8 grid-cols-1 md:grid-cols-2 mb-10">
          <Link href={routes.tips.subroutes.leaderboard.path}>
            <Button variant="secondary" className="mt-6 w-full">
              Tips Leaderboard
            </Button>
          </Link>
          <Link href={routes.tips.subroutes.history.path}>
            <Button variant="secondary" className="mt-6 w-full">
              Tips History
            </Button>
          </Link>
        </div>

        <h2 className="mt-20 mb-8">Your Stats</h2>
        <TipsUserInfo />
        <h2 id="tipping-info">Tipping Info</h2>
        <h3>Overview</h3>
        <p>
          Farther tips are designed to boost quality daily active users. This is
          acheived by scoring tips based on how much the recipients' engagement
          increases throughout each month. The engagement is measured by{" "}
          <ExternalLink href={OPENRANK_DOCS_URL}>OpenRank</ExternalLink>, and
          all the tip scores are summed to form a tipper score. At the end of
          the month, a rewards pool is distributed pro rata based on each
          tipper's score.
        </p>
        <p>
          You can see all your tip scores on the{" "}
          <Link href={routes.tips.subroutes.history.path}>
            tip history page
          </Link>
        </p>
        <div>
          <h3>Eligibility</h3>
          <p>To become eligible for an allowance, tippers must:</p>
          <ol>
            <li>
              Have an{" "}
              <ExternalLink href={OPENRANK_DOCS_URL}>
                OpenRank following rank
              </ExternalLink>{" "}
              below {TIPPER_OPENRANK_THRESHOLD_REQUIREMENT.toLocaleString()}.
              You can check your rank{" "}
              <ExternalLink href={"https://warpcast.com/farther/0xc810c5c7"}>
                here
              </ExternalLink>
              .
            </li>
            <li>
              Currently be holding{" "}
              {TIPPER_REQUIRED_FARTHER_BALANCE.toLocaleString()} Farther tokens
              in a wallet verified on Warpcast. This threshold will adjust to
              include more holders over time, based on the token's current
              price.
            </li>
          </ol>
          <h4>Tipper rewards eligibility</h4>
          <p>
            Before becoming eligible for tipper rewards and appearing on the
            leaderboard, tippers must send a tip on at least{" "}
            {ACTIVE_TIP_DAYS_REQUIRED} days during the month.
          </p>
        </div>
        <h3>Allowance</h3>
        <p>
          The total daily allowance pool currently targets $
          {numeral(DAILY_USD_TOTAL_ALLOWANCE).format("0,0")} of Farther per day
          plus any unused amount from the previous day. A multiplier is applied
          based on their{" "}
          <ExternalLink href={OPENRANK_DOCS_URL}>
            OpenRank following rank
          </ExternalLink>
          , and when a tipper has tipped at least{" "}
          {BREADTH_RATIO_TIP_COUNT_THRESHOLD} times, an additional adjustment is
          made based on how broadly they're distributing their allowance
          throughout the month.
        </p>
        <h3>How to tip</h3>
        <p>
          Send tips by including text like this in replies to casts
          (capitalization and spaces are ignored):
        </p>
        <ul>
          <li>{`42069 farther`}</li>
          <li>{`42069 $farther`}</li>
        </ul>
        <h3>Additional rules</h3>
        <ul>
          <li>Self-tips are rejected</li>
          <li>
            Tip recipients must have at least{" "}
            <strong>{TIPPEE_FOLLOWERS_MIN} followers</strong>.
          </li>
          <li>
            You can only tip the same user once per cycle (cycles are usually 24
            hours but sometimes longer).
          </li>
        </ul>
      </main>
    </Container>
  );
}

export function getStaticProps() {
  return {
    props: {
      seo: {
        title: "Tips",
      },
    },
  };
}

export default TipsPage;
