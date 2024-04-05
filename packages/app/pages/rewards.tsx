import { RewardsTableRow } from "@components/RewardsTableRow";
import { ExternalLink } from "@components/ui/ExternalLink";
import Spinner from "@components/ui/Spinner";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/Table";
import { FARTHER_CHANNEL_URL } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { useLiquidityPositions } from "hooks/useLiquidityPositions";
import React from "react";

export default function RewardsPage() {
  const { account, user, userIsLoading } = useUser();

  const { positions } = useLiquidityPositions();

  return (
    <main className="content mt-16">
      <h1>Rewards</h1>
      {userIsLoading ? (
        <Spinner variant="page" />
      ) : (
        <>
          <p>Your $FARTHER token rewards</p>
          <div className="mt-16">
            {!account.isConnected ? (
              <>Please connect your wallet to check if you have any rewards.</>
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
              <>
                You have no airdrop tokens to claim at this time. If you believe
                this is an error, please reach out in the{" "}
                <ExternalLink href={FARTHER_CHANNEL_URL}>
                  Farther channel
                </ExternalLink>
                .
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
}
