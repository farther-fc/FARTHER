import { DataTable } from "@components/leaderboard/data-table";
import { Container } from "@components/ui/Container";
import { trpcClient } from "@lib/trpcClient";
import { columns } from "@components/leaderboard/columns";
import { leaderboardDummyData } from "../../server/tips/dummyData/leaderboard";

function TipsLeaderboardPage() {
  const { data, isLoading } = trpcClient.public.tips.leaderboard.useQuery();

  console.log(data);

  /**
   * This page should display the leaderboard data, using shadcn DataTable.
   * References:
   * https://ui.shadcn.com/docs/components/data-table
   * https://ui.shadcn.com/examples/tasks
   * https://github.com/shadcn-ui/ui/blob/main/apps/www/app/(app)/examples/tasks/components/data-table.tsx
   */

  return (
    <Container variant="page" className="text-center">
      <main className="content text-2xl ">TipsLeaderboardPage</main>
      <DataTable columns={columns} data={leaderboardDummyData} />
    </Container>
  );
}

export default TipsLeaderboardPage;
