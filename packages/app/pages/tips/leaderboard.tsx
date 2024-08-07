import { Leaderboard } from "@components/leaderboard/Leaderboard";
import { Container } from "@components/ui/Container";
import { ACTIVE_TIP_DAYS_REQUIRED, TIPPER_REWARDS_POOL } from "@farther/common";
import numeral from "numeral";

function TipsLeaderboardPage() {
  return (
    <Container variant="page">
      <h1>Tips Leaderboard</h1>
      <p className="text-muted mb-6">
        The leaderboard includes everyone who tipped in the current season
        (month) for at least {ACTIVE_TIP_DAYS_REQUIRED} days. The current
        rewards pool is {numeral(TIPPER_REWARDS_POOL).format("0,0a")} $farther,
        which is distributed pro rata to tippers with a postive tipper score at
        the end of the month.
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
