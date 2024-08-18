import { Leaderboard } from "@components/leaderboard/Leaderboard";
import { Container } from "@components/ui/Container";
import { ACTIVE_TIP_DAYS_REQUIRED } from "@farther/common";
import { TIP_REWARDS_EXPERIMENTAL_DISCLAIMER } from "@lib/constants";
import { routes } from "@lib/routes";
import Link from "next/link";

function TipsLeaderboardPage() {
  return (
    <Container variant="page">
      <h1 className="text-center lg:text-left mb-8 lg:mb-0">
        Tips Leaderboard
      </h1>
      <div className="text-muted mb-6">
        <p>
          The leaderboard includes everyone who tipped in the current season
          (month) for at least {ACTIVE_TIP_DAYS_REQUIRED} days.{" "}
          <Link href={`${routes.tips.path}#tipping-info`}>Learn more here</Link>
          .
        </p>
        <p>{TIP_REWARDS_EXPERIMENTAL_DISCLAIMER}</p>
      </div>
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
