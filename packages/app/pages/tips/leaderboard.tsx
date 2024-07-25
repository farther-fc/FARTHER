import FartherV2Announcement from "@components/FartherV2Announcement";
import { Leaderboard } from "@components/leaderboard/Leaderboard";
import { Container } from "@components/ui/Container";

function TipsLeaderboardPage() {
  return (
    <Container variant="page">
      <h1>Tips Leaderboard</h1>
      <FartherV2Announcement />
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
