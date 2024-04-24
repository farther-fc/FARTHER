import { AirdropInfo } from "@components/AirdropInfo";
import { ROUTES } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { formatDate, formatWad, startOfNextMonth } from "@lib/utils";
import Link from "next/link";
import { powerUserAirdropConfig } from "@farther/common";
import { InfoCard } from "@components/InfoCard";
import { FartherChannelLink } from "@components/nav/FartherChannelLink";
import { Button } from "@components/ui/Button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { NoUserFoundCard } from "@components/NoUserFoundCard";

export default function AirdropPage() {
  const { account, user, userIsLoading } = useUser();
  const { openConnectModal } = useConnectModal();
  const powerDrop = user?.allocations?.filter(
    (a) => a.type === "POWER_USER",
  )[0];

  return (
    <main className="content">
      <h1>Airdrops</h1>
      {powerDrop && !powerDrop.isClaimed && (
        <InfoCard className="text-center">
          <h3 className="mt-0">Congratulations 🎉</h3>
          {powerDrop.airdrop?.address ? (
            <p>
              You have <strong>{formatWad(powerDrop.amount)} </strong>
              tokens ready to claim on the{" "}
              <Link href={ROUTES.rewards.path}>rewards page</Link>!
            </p>
          ) : (
            <p>
              You are eligible for $FARTHER tokens in the next airdrop! <br />
              Check the <Link href={ROUTES.rewards.path}>
                rewards page
              </Link> on {formatDate(startOfNextMonth())} to claim your rewards.
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
            You are not currently eligible for an airdrop. If you believe this
            is an error, please reach out in the <FartherChannelLink />.
          </InfoCard>
        ) : (
          !user && !userIsLoading && <NoUserFoundCard />
        ))}
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
  );
}
