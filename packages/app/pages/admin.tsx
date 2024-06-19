import { Container } from "@components/ui/Container";
import { LabelValue } from "@components/ui/LabelValue";
import { useUser } from "@lib/context/UserContext";
import { trpcClient } from "@lib/trpcClient";
import { formatWad } from "@lib/utils";
import { useRouter } from "next/router";
import React from "react";

function AdminPage() {
  const { isAdmin, account } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (account.address && !isAdmin) {
      router.push("/404");
    }
  }, [account.address, isAdmin, router]);

  const { data, isLoading } = trpcClient.admin.getAdminData.useQuery(
    undefined,
    {
      enabled: account.address && isAdmin,
    },
  );

  const { powerUserAllocations, evangelistAllocations } = data || {};

  const evangelistTotalAllocated =
    evangelistAllocations?.reduce(
      (acc, cur) => acc + BigInt(cur.amount),
      BigInt(0),
    ) || BigInt(0);

  const powerUserTotalAllocated =
    evangelistAllocations
      ?.filter((a) => a.hasPowerBadge)
      .reduce((acc, cur) => acc + BigInt(cur.amount), BigInt(0)) || BigInt(0);

  const tweetCount = evangelistAllocations?.reduce(
    (acc, cur) => cur.tweets.length + acc,
    0,
  );

  const mostTweetsPerAllocation = evangelistAllocations?.reduce(
    (acc, cur) => (acc > cur.tweets.length ? acc : cur.tweets.length),
    0,
  );

  const avgTweetsPerAllocation =
    tweetCount && evangelistAllocations
      ? tweetCount / evangelistAllocations.length
      : 0;

  const allTweets = evangelistAllocations
    ? evangelistAllocations.reduce(
        (allTweets, cur) => [...allTweets, ...cur.tweets],

        evangelistAllocations[0]?.tweets,
      )
    : [];

  const avgFollowerCount =
    allTweets.reduce((total, tweet) => total + tweet.followerCount, 0) /
    allTweets.length;

  const sortedPowerUserAllocations = powerUserAllocations?.sort((a, b) => {
    if (BigInt(a.amount) < BigInt(b.amount)) {
      return 1;
    } else if (BigInt(a.amount) > BigInt(b.amount)) {
      return -1;
    } else {
      return 0;
    }
  });

  return account.address && isAdmin ? (
    <Container variant="page">
      <div className="content">
        <h1>Admin</h1>
        {isLoading || !sortedPowerUserAllocations ? (
          <p>Loading...</p>
        ) : (
          <>
            <div>
              <h3>Power users</h3>
              <LabelValue
                label="Recipients"
                value={powerUserAllocations?.length}
              />
              <LabelValue
                label="Claimed"
                value={powerUserAllocations?.filter((a) => a.isClaimed).length}
              />
              <LabelValue
                label="Largest allocation"
                value={formatWad(BigInt(sortedPowerUserAllocations[0].amount))}
              />
              <LabelValue
                label="Smallest allocation"
                value={formatWad(
                  BigInt(
                    sortedPowerUserAllocations[
                      sortedPowerUserAllocations.length - 1
                    ].amount,
                  ),
                )}
              />
              <LabelValue
                label="Median allocation"
                value={formatWad(
                  BigInt(
                    sortedPowerUserAllocations[
                      Math.floor(sortedPowerUserAllocations.length / 2)
                    ].amount,
                  ),
                )}
              />
            </div>
            <div>
              <h3>Evangelists</h3>
              <LabelValue label="Total tweets" value={tweetCount} />
              <LabelValue
                label="Unique recipients"
                value={`${evangelistAllocations?.length} (${evangelistAllocations?.filter((a) => a.hasPowerBadge).length} with power badge)`}
              />
              <LabelValue
                label="Total allocated"
                value={formatWad(evangelistTotalAllocated)}
              />
              <LabelValue
                label="Total for power users"
                value={formatWad(powerUserTotalAllocated)}
              />
              <LabelValue
                label="Most tweets per allocation"
                value={mostTweetsPerAllocation}
              />
              <LabelValue
                label="Average tweets per allocation"
                value={avgTweetsPerAllocation.toFixed(2)}
              />
              <LabelValue
                label="Average follower count"
                value={avgFollowerCount.toFixed(2)}
              />
            </div>
            <div>
              <h3>Tips</h3>
              <LabelValue
                label="Total tips"
                value={data?.tipCount.toLocaleString()}
              />
              <LabelValue
                label="Total amount"
                value={data?.tipTotal.toLocaleString()}
              />
              <LabelValue
                label="Invalid tips"
                value={data?.invalidTipCount.toLocaleString()}
              />
              <LabelValue
                label="Tipper lowest balance"
                value={data?.currentTipperLowestBalance.toLocaleString()}
              />
            </div>
          </>
        )}
      </div>
    </Container>
  ) : null;
}

export default AdminPage;
