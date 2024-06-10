import { TipsUserInfo } from "@components/tips/TipsUserInfo";
import { Container } from "@components/ui/Container";
import { ExternalLink } from "@components/ui/ExternalLink";
import { Popover } from "@components/ui/Popover";
import { Skeleton } from "@components/ui/Skeleton";
import Spinner from "@components/ui/Spinner";
import {
  INITIAL_ELIGIBLE_TIPPERS,
  TIP_USD_MINIMUM,
  contractAddresses,
} from "@farther/common";
import dayjs from "dayjs";
import { useTipsMeta } from "hooks/useTipsMeta";
import { Info } from "lucide-react";

function TipsPage() {
  const { createdAt, tipsMetaLoading, tipMinimum, eligibleTippers } =
    useTipsMeta();

  return (
    <Container variant="page">
      <main className="content">
        <h1>Farther Tips</h1>
        <span className="text-ghost text-sm">Cycle start time</span>
        {!tipsMetaLoading && createdAt && (
          <h4 className="mt-2">
            {dayjs(new Date(createdAt)).format("MMM D, YYYY h:mm A")}
          </h4>
        )}
        {!tipsMetaLoading && createdAt ? (
          <div className="mb-10 grid grid-cols-[120px_1fr] gap-2">
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
                <ExternalLink
                  href={`https://basescan.org/token/${contractAddresses.FARTHER}#balances`}
                >
                  Top {eligibleTippers} holders
                </ExternalLink>
                <Popover
                  content={`This number increases over time based on the token's current price to ensure the allowance for each tipper remains valuable enough to make tipping worthwhile.`}
                >
                  <Info className="text-muted ml-2 size-3" />
                </Popover>
              </span>
            </>
          </div>
        ) : (
          <Skeleton className="max-w-[300px]" />
        )}
        <TipsUserInfo />
        <h3 className="mt-12">How to tip</h3>
        <p>
          Send tips by including text like this in replies to casts
          (capitalization and spaces are ignored):
        </p>
        <ul>
          <li>{`42069✨`}</li>
          <li>{`42069 farther`}</li>
          <li>{`42069 $farther`}</li>
        </ul>
        <h4>Maximum distribution ➡️ Greater allowance</h4>
        <p>
          Tippers who distribute to the greatest number of accounts each day
          will receive larger share of daily allowances over time. The aim of
          this is to maximize the number of users receiving tips and mitigate
          bot shenanigans.
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
          <li>Self-tips will be rejected</li>
          <li>Bot farms will be banned</li>
          <li>Frequently tipping below the minimum will be penalized</li>
          <li>
            Accounts that tip frequently without an allowance will be banned
          </li>
        </ul>
        <div className="mt-12">
          <h3>Eligibility</h3>
          <p>
            To become eligible for an allowance, tippers must be holding Farther
            tokens in a wallet they've verified on Warpcast. At launch, the top{" "}
            {INITIAL_ELIGIBLE_TIPPERS} holders received an allowance. This
            threshold will adjust to include more holders over time, based on
            the token's current price. This ensures the allowance for each
            tipper remains valuable enough to make tipping worthwhile.{" "}
          </p>
          <p>
            After a token holder starts receiving allowances, their daily
            allowance will never drop below the tip minimum as long as they
            remain within the top holder threshold. If inactivity results in
            their allowance dropping to the minimum, they can still recover
            their allowance by consistently spending all of it every day.
          </p>
        </div>
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
