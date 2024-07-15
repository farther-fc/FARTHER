import { ExternalLink } from "@components/ui/ExternalLink";
import { API_BATCH_LIMIT } from "@farther/common";
import { useUser } from "@lib/context/UserContext";
import { trpcClient } from "@lib/trpcClient";
import { Tips } from "@lib/types/apiTypes";
import dayjs from "dayjs";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";

export function TipsViewer() {
  const { user } = useUser();
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

  const hasMore = tips.length === API_BATCH_LIMIT && !!data?.nextCursor;

  React.useEffect(() => {
    if (!tipsFromServer.length) return;

    setTips((prev) => [...prev, ...tipsFromServer]);
    setIsLoading(false);
  }, [data?.tips.length]);

  const loadMore = () => {
    if (isLoading || tips.length < API_BATCH_LIMIT) return;
    setIsLoading(true);
    console.log("loadmore called");
    setCursor(new Date(tips[tips.length - 1].createdAt).getTime());
  };

  return (
    <div className="mb-14">
      <h3>Your Tips</h3>
      <div className="h-[300px] overflow-y-auto px-4 bg-background-dark">
        <InfiniteScroll
          loadMore={loadMore}
          hasMore={hasMore}
          useWindow={false}
          threshold={500} // pixel threshold to trigger loadMore
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
        >
          {tips.map((tip) => (
            <div className="grid grid-cols-[200px_200px_1fr]">
              <div>
                <ExternalLink
                  href={`https://warpcast.com/~/conversations/${tip.hash}`}
                >
                  {dayjs(tip.createdAt).format("M.D | h:mm a")}
                </ExternalLink>
              </div>
              <div>{tip.amount.toLocaleString()}</div>
              <div>{tip.tippeeOpenRankScore?.toLocaleString()}</div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}
