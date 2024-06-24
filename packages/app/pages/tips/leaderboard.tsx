import { Container } from "@components/ui/Container";
import { trpcClient } from "@lib/trpcClient";

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
    <Container variant="page">
      <main className="content">TipsLeaderboardPage</main>
    </Container>
  );
}

export default TipsLeaderboardPage;
