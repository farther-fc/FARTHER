import { InfoCard } from "@components/InfoCard";
import { NoUserFoundCard } from "@components/NoUserFoundCard";
import { RewardsTableRow } from "@components/RewardsTableRow";
import { FartherChannelLink } from "@components/nav/FartherChannelLink";
import { Button } from "@components/ui/Button";
import { ExternalLink } from "@components/ui/ExternalLink";
import Spinner from "@components/ui/Spinner";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/Table";
import { useUser } from "@lib/context/UserContext";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useLiquidityPositions } from "hooks/useLiquidityPositions";
import React from "react";

export default function RewardsPage() {
  const { account, user, userIsLoading } = useUser();
  const { positions } = useLiquidityPositions();

  const { openConnectModal } = useConnectModal();
  return (
    <main className="content">
      <h1>Rewards</h1>
      {userIsLoading ? (
        <Spinner variant="page" />
      ) : (
        <>
          <p>Your Farther token rewards</p>
          <div className="mt-8">
            {!account.isConnected ? (
              <InfoCard className="text-center">
                Please{" "}
                <Button variant="link" onClick={openConnectModal}>
                  connect your wallet
                </Button>{" "}
                to check if you have any rewards.
              </InfoCard>
            ) : !user ? (
              <NoUserFoundCard />
            ) : user?.allocations?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.allocations?.map((a) => (
                    <RewardsTableRow key={a.id} allocation={a} />
                  ))}
                </TableBody>
              </Table>
            ) : (
              <InfoCard variant="muted">
                No rewards found. If you believe this is an error, please reach
                out in the <FartherChannelLink />.
              </InfoCard>
            )}
          </div>
        </>
      )}
    </main>
  );
}
