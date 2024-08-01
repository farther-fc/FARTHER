import { Leaderboard } from "@components/leaderboard/Leaderboard";
import { Container } from "@components/ui/Container";

function TipsLeaderboardPage() {
  return (
    <Container variant="page">
      <h1>Tips Leaderboard</h1>
      <p className="text-muted mb-6">
        The leaderboard includes everyone who tipped in the current season
        (month).
      </p>
      <Leaderboard />
    </Container>
  );
}

export function getStaticProps() {
  return {
    props: {
      seo: {
        title: "Tips Leaderboard",
      },
    },
  };
}

export default TipsLeaderboardPage;
