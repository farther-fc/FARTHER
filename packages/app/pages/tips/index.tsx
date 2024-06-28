import { TipsUserInfo } from "@components/tips/TipsUserInfo";
import { Button } from "@components/ui/Button";
import { Container } from "@components/ui/Container";
import { ExternalLink } from "@components/ui/ExternalLink";
import { Popover } from "@components/ui/Popover";
import { Skeleton } from "@components/ui/Skeleton";
import Spinner from "@components/ui/Spinner";
import {
  TIPPER_REQUIRED_FARTHER_BALANCE,
  TIP_USD_MINIMUM,
} from "@farther/common";
import { ROUTES } from "@lib/constants";
import dayjs from "dayjs";
import { useTipsMeta } from "hooks/useTipsMeta";
import { Info } from "lucide-react";
import Link from "next/link";

function TipsPage() {
  const { createdAt, tipsMetaLoading, tipMinimum, eligibleTippers } =
    useTipsMeta();

  return (
    <Container variant="page">
      <main className="content">
        <h1>Farther Tips</h1>
        {!tipsMetaLoading && createdAt && (
          <>
            <span className="text-ghost text-sm">CYCLE START TIME</span>
            <h4 className="mt-2">
              {dayjs(new Date(createdAt)).format("MMM D, YYYY h:mm A")}
            </h4>
          </>
        )}
        {!tipsMetaLoading && createdAt ? (
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <>
              <span className="text-muted">Tip minimum:</span>
              <span className="flex items-center">
                {tipMinimum} ✨{" "}
                <Popover
                  content={`The tip minimum changes daily based on the current equivalent of $${TIP_USD_MINIMUM.toFixed(2)}`}
                >
                  <Info className="text-muted ml-2 size-3" />
                </Popover>
              </span>
              <span className="text-muted">Eligible tippers:</span>
              <span className="flex items-center">
                {eligibleTippers}
                <Popover
                  content={`You must currently have a total balance of ${TIPPER_REQUIRED_FARTHER_BALANCE.toLocaleString()} FARTHER to receive a tip allowance. This number will adjust over time. If you are providing liquidity in the Uniswap 0.3% pool, that will be included.`}
                >
                  <Info className="text-muted ml-2 size-3" />
                </Popover>
              </span>
            </>
          </div>
        ) : (
          <Skeleton className="max-w-[300px]" />
        )}
        <Link href={ROUTES.tipsLeaderboard.path}>
          <Button className="mt-8">View Leaderboard</Button>
        </Link>
        <h3 className="mt-12">Your Stats</h3>
        <TipsUserInfo />
        <h3 className="mt-12">How to tip</h3>
        <p>
          Send tips by including text like this in replies to casts
          (capitalization and spaces are ignored):
        </p>
        <ul>
          <li>{`42069 farther`}</li>
          <li>{`42069 $farther`}</li>
        </ul>
        <h4>Maximum distribution ➡️ Greater allowance</h4>
        <p>
          Tippers who distribute their daily allowance to the greatest number of
          accounts{" "}
          <em className="font-bold">that aren't also receiving an allowance</em>{" "}
          will receive larger share of the daily allowance pool over time. The
          aim of this is to maximize the number of users receiving tips and
          mitigate bot account manipulation.
        </p>
        <h4>Daily tip minimum</h4>
        <p className="whitespace-pre-line">
          Given that the allowance calculation incentivizes broad distribution,
          a floor is set to make each tip meaningful and prevent Farther from
          becoming spammy. This amount may change over time but targets the
          equivalent of ${TIP_USD_MINIMUM.toFixed(2)} (currently{" "}
          {tipsMetaLoading ? <Spinner size="xs" /> : tipMinimum} FARTHER).
        </p>
        <h4>Additional rules</h4>
        <ul>
          <li>Self-tips are rejected</li>
          <li>
            Any account tipping below the minimum more than 3 times per day on a
            consistent basis is assumed to be intentionally fake tipping. A
            warning will be issued, then a ban.
          </li>
          <li>
            Accounts that tip frequently without an allowance will also be
            warned and banned if it continues.
          </li>
          <li>
            High-volume tip trading will result in a warning and ban if it
            continues. High volume is defined as 5 or more tip trades per day on
            a consistent basis.
          </li>
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
          <p>
            After a token holder starts receiving allowances, their daily
            allowance will never drop below the tip minimum as long as they
            remain within the top holder threshold. If inactivity results in
            their allowance dropping to the minimum, they can still recover
            their allowance by consistently spending all of it every day.
          </p>
        </div>
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
