import { Container } from "@components/ui/Container";
import { ExternalLink } from "@components/ui/ExternalLink";
import { Skeleton } from "@components/ui/Skeleton";
import { Tooltip } from "@components/ui/Tooltip";
import { API_BATCH_LIMIT } from "@farther/common";
import { invalidTipReasons } from "@lib/constants";
import { useMediaQuery } from "@lib/context/MediaQueryContext";
import { useUser } from "@lib/context/UserContext";
import { trpcClient } from "@lib/trpcClient";
import { Tips } from "@lib/types/apiTypes";
import dayjs from "dayjs";
import { ExternalLinkIcon } from "lucide-react";
import numeral from "numeral";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";

const GRID_STYLES =
  "grid grid-cols-[4px_25px_35px_minmax(100px,1fr)_minmax(50px,200px)_70px] md:grid-cols-[8px_50px_minmax(60px,200px)_minmax(140px,1fr)_minmax(80px,200px)_80px] gap-1 relative";

const Row = ({ tip, isTablet }: { tip: Tips[number]; isTablet: boolean }) => (
  <div
    className={`pr-2 md:pr-5 block hover:bg-background group cursor-default`}
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
        <span>{tip.tippee?.username || "unknown"}</span>
      </div>
      <div className="flex justify-end text-right self-stretch items-center">
        <span>
          {tip.invalidTipReason
            ? "_"
            : numeral(tip.openRankChange || 0).format("0,0.[000]a")}
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
  const { user, accountAddress, userIsLoading } = useUser();
  const [cursor, setCursor] = React.useState<number | undefined>();
  const { isTablet } = useMediaQuery();
  const [isLoading, setIsLoading] = React.useState(false);
  const { data } = trpcClient.public.tips.byTipper.useQuery(
    {
      fid: user?.fid || Number.POSITIVE_INFINITY,
      cursor: cursor,
    },
    { enabled: !!user?.fid },
  );
  const tipsFromServer = data?.tips || [];
  const [tips, setTips] = React.useState<Tips>([]);

  const hasMore =
    tipsFromServer.length === API_BATCH_LIMIT && !!data?.nextCursor;

  React.useEffect(() => {
    if (!tipsFromServer.length && isLoading) {
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
  }, [tipsFromServer.length, isLoading]);

  React.useEffect(() => {
    if (!user && userIsLoading) {
      setIsLoading(true);
    }
    if (user || userIsLoading) {
      return;
    }
    setTips([]);
  }, [user, userIsLoading]);

  const loadMore = () => {
    if (isLoading || tips.length < API_BATCH_LIMIT) return;
    setCursor(new Date(tips[tips.length - 1].createdAt).getTime());
  };

  const colHeadings = ["", "", "Date", "Recipient", "OpenRank δ", "Amount"];

  return (
    <Container variant="page">
      <h1>Tip History</h1>
      <div className="text-xs md:text-sm">
        <p className="text-muted mb-8">
          These are all the tips you've given other Farcaster users.
        </p>
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
        {isLoading || userIsLoading ? (
          <Skeleton className="h-[500px] rounded-xl" />
        ) : (
          <div className="mb-14 border-ghost border rounded-xl overflow-hidden">
            <div className="h-[500px] overflow-y-auto bg-background-dark rounded-xl">
              <InfiniteScroll
                loadMore={loadMore}
                hasMore={hasMore}
                useWindow={false}
                threshold={600} // pixel threshold to trigger loadMore
                loader={
                  <div className="loader" key={0}>
                    Loading ...
                  </div>
                }
              >
                {!tips.length && !isLoading && !userIsLoading ? (
                  <div className="m-auto w-[200px] text-center h-[480px] justify-center flex items-center text-ghost">
                    {!accountAddress
                      ? "Please connect your wallet to view your tips"
                      : "No tips found"}
                  </div>
                ) : (
                  tips.map((tip) => {
                    if (tip.invalidTipReason) {
                      console.log(
                        tip.hash,
                        invalidTipReasons[tip.invalidTipReason],
                      );
                    }
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
                  })
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
