import { AirdropInfo } from "@components/AirdropInfo";
import { ROUTES } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { formatDate, formatWad } from "@lib/utils";
import Link from "next/link";
import { powerUserAirdropConfig } from "@farther/common";
import { InfoContainer } from "@components/InfoContainer";
import { FartherChannelLink } from "@components/nav/FartherChannelLink";
import { Button } from "@components/ui/Button";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export default function AirdropPage() {
  const { account, user } = useUser();
  const { openConnectModal } = useConnectModal();
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
              You are eligible for tokens in the next airdrop! <br />
              Check the <Link href={ROUTES.rewards.path}>
                rewards page
              </Link>{" "}
              after {formatDate(powerUserAirdropConfig.CLAIM_DATE)} to claim
              your rewards.
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
            <InfoContainer variant="muted">
              You are not currently eligible for an airdrop. If you believe this
              is an error, please reach out in the <FartherChannelLink />.
            </InfoContainer>
          )
        ))}
      <AirdropInfo />
      {!account.isConnected && (
        <InfoContainer className="text-center">
          If you think you are eligible for an airdrop,{" "}
          <Button variant="link" onClick={openConnectModal}>
            connect your wallet
          </Button>{" "}
          and visit the <Link href={ROUTES.rewards.path}>rewards</Link> page.
        </InfoContainer>
      )}
    </main>
  );
}
