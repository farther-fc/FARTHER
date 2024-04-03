import { AirdropInfo } from "@components/AirdropInfo";
import { Container } from "@components/ui/Container";
import { ROUTES } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { formatWad } from "@lib/utils";
import Link from "next/link";

export default function AirdropPage() {
  const { account, user } = useUser();
  const claimableAllocations = user?.allocations?.filter(
    (a) => !a.isClaimed && a.airdrop.type === "POWER_USER",
  );

  const powerDrop = claimableAllocations?.[0];

  return (
    <main className="content mt-16">
      <h1>Airdrops</h1>
      {powerDrop && (
        <div>
          <h3>Congratulations! 🎉</h3>
          <p>
            You have <strong>{formatWad(powerDrop.amount)} </strong>tokens ready
            to claim on the <Link href={ROUTES.claims.path}>claims page</Link>
          </p>
          <hr />
          <h2>About airdrops</h2>
        </div>
      )}
      <AirdropInfo />
      {!account.isConnected && (
        <p className={"mt-12"}>
          If you think you are eligible, connect your wallet and visit the{" "}
          <Link href={ROUTES.claims.path}>claims</Link> page.
        </p>
      )}
    </main>
  );
}
