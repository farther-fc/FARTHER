import { AirdropInfo } from "@components/AirdropInfo";
import { InfoCard } from "@components/InfoCard";
import { NoUserFoundCard } from "@components/NoUserFoundCard";
import { Button } from "@components/ui/Button";
import { Container } from "@components/ui/Container";
import { ExternalLink } from "@components/ui/ExternalLink";
import Spinner from "@components/ui/Spinner";
import { startOfNextMonth } from "@farther/common";
import { POWER_BADGE_INFO_URL, ROUTES } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { formatDate, formatWad } from "@lib/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function AirdropPage() {
  const { account, user, userIsLoading } = useUser();
  const { openConnectModal } = useConnectModal();
  const powerDrop = user?.allocations?.filter(
    (a) => a.type === "POWER_USER",
  )[0];

  return (
    <Container variant="page">
      <main className="content">
        <h1>Airdrops</h1>
        {powerDrop && !powerDrop.isClaimed && (
          <InfoCard className="text-center">
            <h3 className="mt-0 border-none">Congratulations 🎉</h3>
            {powerDrop.airdrop?.address ? (
              <p>
                You have <strong>{formatWad(powerDrop.amount)} </strong>
                tokens ready to claim on the{" "}
                <Link href={ROUTES.rewards.path}>rewards page</Link>!
              </p>
            ) : (
              <p>
                You are eligible for FARTHER tokens in the next airdrop! <br />
                Check the <Link href={ROUTES.rewards.path}>
                  rewards page
                </Link>{" "}
                on {formatDate(startOfNextMonth())} to claim your rewards.
              </p>
            )}
          </InfoCard>
        )}
        {account.isConnected &&
          (powerDrop && powerDrop?.isClaimed ? (
            <InfoCard variant="muted" className="text-center">
              You have already claimed your airdrop. ✨
            </InfoCard>
          ) : user && !powerDrop ? (
            <InfoCard variant="muted">
              You are not currently eligible for an airdrop.{" "}
              {!user.powerBadge ? (
                <>
                  This is likely because you don't have a{" "}
                  <ExternalLink href={POWER_BADGE_INFO_URL}>
                    Warpcast Power Badge
                  </ExternalLink>
                  . As soon as you earn it, you'll become eligible for an
                  airdrop at the end of that month.
                </>
              ) : (
                ""
              )}
            </InfoCard>
          ) : (
            !user && !userIsLoading && <NoUserFoundCard />
          ))}
        {account.isConnected && !user && userIsLoading && (
          <InfoCard variant="muted" className="flex justify-center">
            <Spinner />
          </InfoCard>
        )}
        <AirdropInfo />
        {!account.isConnected && (
          <InfoCard className="text-center">
            If you think you are eligible for an airdrop,{" "}
            <Button variant="link" onClick={openConnectModal}>
              connect your wallet
            </Button>{" "}
            and visit the <Link href={ROUTES.rewards.path}>rewards</Link> page.
          </InfoCard>
        )}
      </main>
    </Container>
  );
}

export function getStaticProps() {
  return {
    props: {
      seo: {
        title: "Airdrops",
      },
    },
  };
}
