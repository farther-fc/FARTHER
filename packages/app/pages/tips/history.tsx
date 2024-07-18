import { Container } from "@components/ui/Container";
import { ExternalLink } from "@components/ui/ExternalLink";
import { Skeleton } from "@components/ui/Skeleton";
import { API_BATCH_LIMIT } from "@farther/common";
import { useUser } from "@lib/context/UserContext";
import { trpcClient } from "@lib/trpcClient";

import { Tips } from "@lib/types/apiTypes";
import dayjs from "dayjs";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";

function TipsHistoryPage() {
  const { user, userIsLoading } = useUser();
  const [cursor, setCursor] = React.useState<number | undefined>();
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
    if (!tipsFromServer.length) return;

    setTips((prev) => {
      const allTips = [...prev, ...tipsFromServer];
      const uniqueTips = allTips.filter(
        (tip, i) => allTips.findIndex((t) => t.hash === tip.hash) === i,
      );
      return uniqueTips;
    });
    setIsLoading(false);
  }, [data?.tips.length]);

  React.useEffect(() => {
    if (user) return;
    if (userIsLoading) {
      setIsLoading(true);
    } else {
      setTips([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadMore = () => {
    console.log("loadmore called");
    if (isLoading || tips.length < API_BATCH_LIMIT) return;
    setIsLoading(true);
    setCursor(new Date(tips[tips.length - 1].createdAt).getTime());
  };

  const gridStyles =
    "grid grid-cols-[minmax(80px,250px)_minmax(100px,1fr)_80px] gap-1";

  return (
    <Container variant="page">
      <h1>Tip History</h1>
      <div className={`${gridStyles} px-2 md:px-8 py-2 text-muted mr-3`}>
        {["Date", "Recipient", "Amount"].map((text, i) => (
          <div className={i === 2 ? "text-right" : "text-left"}>{text}</div>
        ))}
      </div>
      {isLoading ? (
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
              {!tips.length && !isLoading ? (
                <div className="w-full h-[480px] justify-center flex items-center text-ghost">
                  {!user
                    ? "Please connect your wallet to view your tips"
                    : "No tips found"}
                </div>
              ) : (
                tips.map((tip) => (
                  <ExternalLink
                    key={tip.hash}
                    href={`https://warpcast.com/~/conversations/${tip.hash}`}
                    className="hover:no-underline text-white hover:text-link px-2 md:px-8 py-1 block hover:bg-background"
                  >
                    <div className={gridStyles}>
                      <div> {dayjs(tip.createdAt).format("M.D | h:mm a")}</div>
                      <div>{tip.tippee?.username || "unknown"}</div>
                      <div className="text-right">
                        {tip.amount.toLocaleString()} ✨
                      </div>
                      {/* <div>{tip.tippeeOpenRankScore?.toLocaleString()}</div> */}
                    </div>
                  </ExternalLink>
                ))
              )}
            </InfiniteScroll>
          </div>
        </div>
      )}
    </Container>
  );
}

export default TipsHistoryPage;
