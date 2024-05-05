import { Container } from "@components/ui/Container";
import { trpcClient } from "@lib/trpcClient";
import { formatWad } from "@lib/utils";

function AdminPage() {
  const { data, isLoading } = trpcClient.getAdminData.useQuery();

  const evangelistTotalAllocated =
    data?.tweets.reduce((acc, cur) => acc + BigInt(cur.reward), BigInt(0)) ||
    BigInt(0);

  const evangelistFids = data?.tweets.map((t) => t.allocation.userId);

  return (
    <Container variant="page">
      <div className="content">
        <h1>Admin</h1>
        <div>
          <h2>Power users</h2>
          <p>Recipients: {data?.powerUserAllocations.length}</p>
          <p>
            Claimed:{" "}
            {data?.powerUserAllocations.filter((a) => a.isClaimed).length}
          </p>
        </div>
        <div>
          <h2>Evangelists</h2>
          <p>Total tweets: {data?.tweets.length}</p>
          <p>Unique recipients: {new Set(evangelistFids).size}</p>
          <p>
            Total allocated: {formatWad(evangelistTotalAllocated.toString())}{" "}
          </p>
        </div>
      </div>
    </Container>
  );
}

export default AdminPage;
