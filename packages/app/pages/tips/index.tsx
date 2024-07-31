import { InfoCard } from "@components/InfoCard";
import { TipperScore } from "@components/tips/TipperScore";
import { TipsUserInfo } from "@components/tips/TipsUserInfo";
import { Button } from "@components/ui/Button";
import { Container } from "@components/ui/Container";
import { ExternalLink } from "@components/ui/ExternalLink";
import { Popover } from "@components/ui/Popover";
import { Skeleton } from "@components/ui/Skeleton";
import {
  TIPPEE_FOLLOWERS_MIN,
  TIPPER_REQUIRED_FARTHER_BALANCE,
  TIPPER_REWARDS_POOL,
  dayUTC,
} from "@farther/common";
import { OPENRANK_ENGAGEMENT_DOCS_URL } from "@lib/constants";
import { routes } from "@lib/routes";
import dayjs from "dayjs";
import { useTipsMeta } from "hooks/useTipsMeta";
import { HelpCircle } from "lucide-react";
import Link from "next/link";
import numeral from "numeral";

function TipsPage() {
  const { createdAt, tipsMetaLoading, eligibleTippers } = useTipsMeta();

  return (
    <Container variant="page">
      <main className="content">
        <h1>Tips</h1>
        <div className="flex justify-center flex-col items-center">
          <span className="text-ghost text-sm uppercase">
            {dayUTC().format("MMMM")} Rewards Pool
          </span>
          <span className="mt-2 mb-0 text-3xl">
            <Popover
              content={`The rewards pool is distributed at the end of the month, pro rata to all tippers who have a positive tipper score. Each score is like a weight, and the tipper's portion of the pool is based on their score relative to the sum of all positive scores.`}
            >
              <div className="flex items-center justify-end">
                {numeral(TIPPER_REWARDS_POOL).format("0,0")} ✨{" "}
                <HelpCircle className="text-muted ml-2 size-4" />
              </div>
            </Popover>
          </span>
        </div>
        <h4 className="text-ghost mt-8 text-sm uppercase">Current Cycle</h4>
        {!tipsMetaLoading && createdAt ? (
          <InfoCard className="grid grid-cols-2 mt-0">
            <div>
              {!tipsMetaLoading && createdAt && (
                <>
                  <span className="text-ghost text-sm uppercase">
                    Start Time
                  </span>
                  <h5 className="mt-2 mb-0">
                    {dayjs(new Date(createdAt)).format("MMM D ha")}
                  </h5>
                </>
              )}
            </div>

            <div className="text-right">
              <div className="">
                <span className="text-ghost text-sm uppercase">
                  Eligible Tippers
                </span>
                <h5 className="flex items-center mt-2 mb-0 justify-end">
                  {eligibleTippers}
                  <Popover
                    content={`You must currently have a total balance of ${TIPPER_REQUIRED_FARTHER_BALANCE.toLocaleString()} FARTHER to receive a tip allowance. This number will adjust over time. If you are providing liquidity in the Uniswap 0.3% pool, that will be included.`}
                  >
                    <HelpCircle className="text-muted ml-2 size-3" />
                  </Popover>
                </h5>
              </div>
            </div>
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
        <TipperScore />
        <TipsUserInfo />
        <h2 className="mt-20">Tipping Info</h2>
        <h3 className="mt-12">Overview</h3>
        <p>
          Unlike most other tipping tokens on Farcaster, Farther tips are
          designed to boost quality daily active users. This is acheived by
          scoring tips based on how much the recipients' engagement increases
          throughout each month. The engagement is measured by{" "}
          <ExternalLink href={OPENRANK_ENGAGEMENT_DOCS_URL}>
            OpenRank
          </ExternalLink>
          , and all the tip scores combine to form a score for each tipper. At
          the end of the month, a rewards pool is distributed pro rata based on
          each tipper's score.
        </p>
        <br />
        <p>
          You can see all your tip scores on the{" "}
          <Link href={routes.tips.subroutes.history.path}>
            tip history page
          </Link>
        </p>
        <h3 className="mt-12">How to tip</h3>
        <p>
          Send tips by including text like this in replies to casts
          (capitalization and spaces are ignored):
        </p>
        <ul>
          <li>{`42069 farther`}</li>
          <li>{`42069 $farther`}</li>
        </ul>
        <div className="mt-12">
          <h3>Eligibility</h3>
          <p>
            To become eligible for an allowance, tippers must currently be
            holding {TIPPER_REQUIRED_FARTHER_BALANCE.toLocaleString()} Farther
            tokens in a wallet they've verified on Warpcast. This threshold will
            adjust to include more holders over time, based on the token's
            current price. This ensures the allowance for each tipper remains
            valuable enough to make tipping worthwhile.{" "}
          </p>
        </div>
        <h4>Additional rules</h4>
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
        <p className="mt-6">
          If you're interested in more details, check out the{" "}
          <ExternalLink href="https://spice-nova-190.notion.site/Farther-Tips-Deep-Dive-6f955b57ca5847229187ba22bf9b7eef">
            Farther Tips Deep Dive
          </ExternalLink>
          .
        </p>
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
