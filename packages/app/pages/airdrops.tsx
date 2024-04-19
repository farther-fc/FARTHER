import { AirdropInfo } from "@components/AirdropInfo";
import { FARTHER_CHANNEL_URL, ROUTES } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { formatDate, formatWad } from "@lib/utils";
import Link from "next/link";
import { powerUserAirdropConfig } from "@farther/common";
import { ExternalLink } from "@components/ui/ExternalLink";
import { InfoContainer } from "@components/InfoContainer";

export default function AirdropPage() {
  const { account, user } = useUser();
  const powerDrop = user?.allocations?.filter(
    (a) => a.type === "POWER_USER",
  )[0];

  return (
    <main className="content">
      <h1>Airdrops</h1>
      {powerDrop && !powerDrop.isClaimed && (
        <InfoContainer>
          <h3 className="mt-0">Congratulations 🎉</h3>
          {powerDrop.airdrop?.address ? (
            <p>
              You have <strong>{formatWad(powerDrop.amount)} </strong>
              tokens ready to claim on the{" "}
              <Link href={ROUTES.rewards.path}>rewards page</Link>!
            </p>
          ) : (
            <p>
              You are eligible for{" "}
              <strong>{formatWad(powerDrop.amount)} </strong>
              tokens in the next airdrop! Check the{" "}
              <Link href={ROUTES.rewards.path}>rewards page</Link> after{" "}
              {formatDate(powerUserAirdropConfig.CLAIM_DATE)} to claim your
              rewards.
            </p>
          )}
        </InfoContainer>
      )}
      {account.isConnected &&
        (powerDrop?.isClaimed ? (
          <InfoContainer variant="muted">
            You have already claimed your airdrop.
          </InfoContainer>
        ) : (
          !powerDrop && (
            <>
              You are not currently eligible for an airdrop. If you believe this
              is an error, please reach out in the{" "}
              <ExternalLink href={FARTHER_CHANNEL_URL}>
                Farther channel
              </ExternalLink>
            </>
          )
        ))}
      <AirdropInfo />
      {!account.isConnected && (
        <InfoContainer variant="muted">
          <p className={"mt-12"}>
            If you think you are eligible, connect your wallet and visit the{" "}
            <Link href={ROUTES.rewards.path}>rewards</Link> page.
          </p>
        </InfoContainer>
      )}
    </main>
  );
}
