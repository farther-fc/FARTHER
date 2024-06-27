import { AirdropInfo } from "@components/AirdropInfo";
import { InfoCard } from "@components/InfoCard";
import { NoUserFoundCard } from "@components/NoUserFoundCard";
import { Button } from "@components/ui/Button";
import { Container } from "@components/ui/Container";
import { ExternalLink } from "@components/ui/ExternalLink";
import { Skeleton } from "@components/ui/Skeleton";
import { POWER_BADGE_INFO_URL, ROUTES, clickIds } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { formatAirdropTime, formatWad } from "@lib/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function AirdropPage() {
  const { accountAddress, user, userIsLoading } = useUser();
  const { openConnectModal } = useConnectModal();
  const powerDrop = user?.allocations?.filter(
    (a) => a.type === "POWER_USER",
  )[0];

  return (
    <Container variant="page">
      <main className="content">
        <h1>Powerdrops</h1>
        {powerDrop && !powerDrop.isClaimed && (
          <InfoCard className="text-center">
            <h3 className="mt-0 border-none">Congratulations 🎉</h3>
            {powerDrop.airdrop?.address ? (
              <p>
                You have <strong>{formatWad(BigInt(powerDrop.amount))} </strong>
                tokens ready to claim on your{" "}
                <Link href={ROUTES.profile.path}>profile page</Link>!
              </p>
            ) : (
              <p>
                You are eligible for FARTHER tokens in the next airdrop! <br />
                Check your <Link href={ROUTES.profile.path}>
                  profile page
                </Link>{" "}
                on {formatAirdropTime()} to claim your rewards.
              </p>
            )}
          </InfoCard>
        )}
        {accountAddress &&
          (powerDrop && powerDrop?.isClaimed ? (
            <InfoCard variant="ghost" className="text-center">
              You have already claimed your airdrop. ✨
            </InfoCard>
          ) : user && !powerDrop ? (
            <InfoCard variant="ghost">
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
        {accountAddress && !user && userIsLoading && (
          <Skeleton className="h-[120px]" />
        )}
        <AirdropInfo />
        {!accountAddress && (
          <InfoCard className="text-center">
            If you think you are eligible for an airdrop,{" "}
            <Button
              sentryId={clickIds.airdropPageConnectWallet}
              variant="link"
              onClick={openConnectModal}
            >
              connect your wallet
            </Button>{" "}
            and visit the <Link href={ROUTES.profile.path}>profile</Link> page.
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
        title: "Powerdrops",
      },
    },
  };
}
