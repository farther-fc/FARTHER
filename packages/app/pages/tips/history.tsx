import { TipperScore } from "@components/tips/TipperScore";
import { Container } from "@components/ui/Container";
import { ExternalLink } from "@components/ui/ExternalLink";
import { Popover } from "@components/ui/Popover";
import { Skeleton } from "@components/ui/Skeleton";
import { Tooltip } from "@components/ui/Tooltip";
import { API_BATCH_LIMIT } from "@farther/common";
import {
  FARTHER_V2_PARAGRAPH_URL,
  OPENRANK_ENGAGEMENT_DOCS_URL,
  invalidTipReasons,
} from "@lib/constants";
import { useMediaQuery } from "@lib/context/MediaQueryContext";
import { useUser } from "@lib/context/UserContext";
import { routes } from "@lib/routes";
import { trpcClient } from "@lib/trpcClient";
import { Tips } from "@lib/types/apiTypes";
import dayjs from "dayjs";
import { ExternalLinkIcon, HelpCircle } from "lucide-react";
import numeral from "numeral";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";

const GRID_STYLES =
  "grid grid-cols-[4px_25px_35px_minmax(90px,1fr)_minmax(70px,200px)_80px] md:grid-cols-[8px_50px_minmax(60px,200px)_minmax(140px,1fr)_minmax(80px,1fr)_minmax(80px,1fr)] gap-1 relative";

const CycleHeaderRow = ({ cycleStartTime }: { cycleStartTime: string }) => (
  <div className="bg-background-500 text-md uppercase text-muted py-2 px-2 border-t-2 border-ghost flex justify-center border-b-ghost-light border-b">
    <span className="text-ghost mr-1">Cycle start:</span>{" "}
    {dayjs(cycleStartTime).format("MMM D Ha")}
  </div>
);

const Row = ({ tip, isTablet }: { tip: Tips[number]; isTablet: boolean }) => (
  <div
    className={`pr-2 md:pr-5 block ${tip.invalidTipReason ? "hover:bg-background-700" : ""} hover:bg-background group cursor-default`}
  >
    <div className={GRID_STYLES}>
      <div
        className={`self-stretch ${tip.invalidTipReason ? "bg-red-700" : ""}`}
      />
      <ExternalLink
        key={tip.hash}
        href={`https://warpcast.com/~/conversations/${tip.hash}`}
        className={`hover:no-underline ${tip.invalidTipReason ? "text-red-200 group-hover:text-red-300" : "text-link-hover group-hover:text-link"} flex self-stretch items-center md:pl-4 py-1`}
      >
        <ExternalLinkIcon size={16} />
      </ExternalLink>
      <div className="text-muted py-1 flex items-center">
        <span>
          {dayjs(tip.createdAt).format(isTablet ? "M/D | h:mm a" : "M/D")}
        </span>
      </div>
      <div className="py-1 flex items-center">
        <span>
          <ExternalLink
            href={
              tip.tippee?.username
                ? `https://warpcast.com/${tip.tippee?.username}`
                : `https://warpcast.com/~/profiles/${tip.tippee.id}`
            }
          >
            {tip.tippee?.username || tip.tippee.id}
          </ExternalLink>
        </span>
      </div>
      <div className="flex justify-end text-right self-stretch items-center">
        <span>
          {tip.invalidTipReason
            ? "x"
            : tip.openRankChange
              ? numeral(tip.openRankChange).format("0,0.[00]")
              : "..."}
        </span>
      </div>
      <div className="text-right py-1 flex justify-end self-stretch items-center">
        <span>
          {tip.amount.toLocaleString()} {tip.invalidTipReason ? "🚫" : "✨"}
        </span>
      </div>
    </div>
  </div>
);

function TipHistoryPage() {
  const { user, accountAddress, userLoading } = useUser();
  const [cursor, setCursor] = React.useState<number | undefined>();
  const { isTablet } = useMediaQuery();
  const [isLoading, setIsLoading] = React.useState(false);
  const { data, isLoading: serverDataLoading } =
    trpcClient.public.tips.byTipper.useQuery(
      {
        fid: user?.fid || Number.POSITIVE_INFINITY,
        cursor: cursor,
      },
      { enabled: !!user?.fid },
    );
  const tipsFromServer = data?.tips;
  const [tips, setTips] = React.useState<Tips>([]);

  const hasMore =
    tipsFromServer?.length === API_BATCH_LIMIT && !!data?.nextCursor;

  React.useEffect(() => {
    if (!tipsFromServer) return;

    if (tipsFromServer?.length === 0 && !serverDataLoading && !userLoading) {
      setIsLoading(false);
      return;
    }

    setTips((prev) => {
      const allTips = [...prev, ...tipsFromServer];
      const uniqueTips = allTips.filter(
        (tip, i) => allTips.findIndex((t) => t.hash === tip.hash) === i,
      );
      return uniqueTips;
    });
    setIsLoading(false);
  }, [tipsFromServer?.length, isLoading]);

  React.useEffect(() => {
    if (userLoading) {
      setIsLoading(true);
      setTips([]);
    }
    if (!user) {
      setTips([]);
    }
  }, [user, userLoading]);

  const loadMore = () => {
    if (isLoading || tips.length < API_BATCH_LIMIT) return;
    setCursor(new Date(tips[tips.length - 1].createdAt).getTime());
  };

  const colHeadings = [
    "",
    "",
    "Date",
    "Recipient",
    <Popover
      content={
        <>
          <p>
            Each tip score represents the change in the recipient's engagement
            (as measured by{" "}
            <ExternalLink href={OPENRANK_ENGAGEMENT_DOCS_URL}>
              OpenRank
            </ExternalLink>
            ) since the time the tip was made. It is updated daily up until the
            end of the month. Your tipper score is an average of all the tip
            scores.
          </p>
          <p>
            Learn more{" "}
            <ExternalLink href={FARTHER_V2_PARAGRAPH_URL}>here</ExternalLink>
          </p>
        </>
      }
    >
      <div className="flex justify-end left-3 relative">
        Score
        <HelpCircle className="ml-1 size-3" />
      </div>
    </Popover>,
    "Amount",
  ];

  const tipGroupsObj = tips.reduce(
    (acc, tip) => {
      const { cycleStartTime } = tip;

      if (!acc[cycleStartTime]) {
        acc[cycleStartTime] = [];
      }

      acc[cycleStartTime].push(tip);

      return acc;
    },
    {} as { [cycleStartTime: string]: Tips },
  );

  const tipsGroupedByCycle = Object.values(tipGroupsObj);

  return (
    <Container variant="page">
      <h1>Tip History</h1>
      {(user || userLoading) && <TipperScore />}
      <div className="text-xs md:text-sm">
        {user && !isLoading && (
          <p className="text-muted mb-8">
            {tips.length ? (
              "These are all the tips you've given other Farcaster users."
            ) : (
              <>
                You haven't given any tips yet. Go{" "}
                <ExternalLink href={routes.tips.path}>here</ExternalLink> to
                learn how to get started.
              </>
            )}
          </p>
        )}
        <div className={`${GRID_STYLES} py-2 text-ghost uppercase md:mr-9`}>
          {colHeadings.map((text, i) => (
            <div
              key={i}
              className={
                i >= colHeadings.length - 2 ? "text-right" : "text-left"
              }
            >
              {text}
            </div>
          ))}
        </div>
        {isLoading || userLoading ? (
          <Skeleton className="h-[400px] md:h-[500px] rounded-xl" />
        ) : (
          <div className="border-ghost border rounded-xl overflow-hidden">
            <div className="h-[400px] md:h-[500px] overflow-y-auto bg-background-600 rounded-xl">
              <InfiniteScroll
                loadMore={loadMore}
                hasMore={hasMore}
                useWindow={false}
                threshold={600} // pixel threshold to trigger loadMore
                loader={
                  <div
                    className="px-2 py-2 flex justify-center items-center"
                    key={0}
                  >
                    Loading more tips...
                  </div>
                }
              >
                {!tips.length && !isLoading && !userLoading ? (
                  <div className="m-auto w-[200px] text-center h-[480px] justify-center flex items-center text-ghost">
                    {!accountAddress
                      ? "Please connect your wallet to view your tips"
                      : "No tips found"}
                  </div>
                ) : (
                  tipsGroupedByCycle.map((cycleTips, i) => (
                    <>
                      <CycleHeaderRow
                        key={i}
                        cycleStartTime={cycleTips[0].cycleStartTime}
                      />
                      <div className="mt-1 mb-2">
                        {cycleTips.map((tip) => {
                          return tip.invalidTipReason ? (
                            <Tooltip
                              key={tip.hash}
                              content={invalidTipReasons[tip.invalidTipReason]}
                            >
                              <div>
                                <Row tip={tip} isTablet={isTablet} />
                              </div>
                            </Tooltip>
                          ) : (
                            <Row tip={tip} isTablet={isTablet} />
                          );
                        })}
                      </div>
                    </>
                  ))
                )}
              </InfiniteScroll>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

export function getStaticProps() {
  return {
    props: {
      seo: {
        title: "Tip History",
      },
    },
  };
}

export default TipHistoryPage;
