import { Container } from "@components/ui/Container";
import { trpcClient } from "@lib/trpcClient";
import { formatWad } from "@lib/utils";

function AdminPage() {
  const { data, isLoading } = trpcClient.getAdminData.useQuery();

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

  return (
    <Container variant="page">
      <div className="content">
        <h1>Admin</h1>
        {isLoading ? (
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
      </div>
    </Container>
  );
}

export default AdminPage;
