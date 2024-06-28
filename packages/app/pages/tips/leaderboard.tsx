import { columns } from "@components/leaderboard/columns";
import { DataTable } from "@components/leaderboard/data-table";
import { Container } from "@components/ui/Container";
import { trpcClient } from "@lib/trpcClient";

function TipsLeaderboardPage() {
  const { data } = trpcClient.public.tips.leaderboard.useQuery();

  return (
    <Container variant="page">
      <h1>Tips Leaderboard</h1>
      <DataTable columns={columns} data={data} />
    </Container>
  );
}

export default TipsLeaderboardPage;
