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
              <h2>Power users</h2>
              <p>Recipients: {powerUserAllocations?.length}</p>
              <p>
                Claimed:{" "}
                {powerUserAllocations?.filter((a) => a.isClaimed).length}
              </p>
              <p>
                Largest allocation:{" "}
                {formatWad(BigInt(sortedPowerUserAllocations[0].amount))}
              </p>
              <p>
                Smallest allocation:{" "}
                {formatWad(
                  BigInt(
                    sortedPowerUserAllocations[
                      sortedPowerUserAllocations.length - 1
                    ].amount,
                  ),
                )}
              </p>
              <p>
                Median allocation:{" "}
                {formatWad(
                  BigInt(
                    sortedPowerUserAllocations[
                      Math.floor(sortedPowerUserAllocations.length / 2)
                    ].amount,
                  ),
                )}
              </p>
            </div>
            <div>
              <h2>Evangelists</h2>
              <p>Total tweets: {tweetCount}</p>
              <p>
                Unique recipients: {evangelistAllocations?.length} (
                {evangelistAllocations?.filter((a) => a.hasPowerBadge).length}{" "}
                with power badge)
              </p>
              <p>Total allocated: {formatWad(evangelistTotalAllocated)} </p>
              <p>
                Total for power users: {formatWad(powerUserTotalAllocated)}{" "}
              </p>
            </div>
          </>
        )}
        <h2>Tips</h2>
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
    </Container>
  ) : null;
}

export default AdminPage;
