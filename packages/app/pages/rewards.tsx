import { InfoCard } from "@components/InfoCard";
import { NoUserFoundCard } from "@components/NoUserFoundCard";
import { RewardsTableRow } from "@components/RewardsTableRow";
import { FartherChannelLink } from "@components/nav/FartherChannelLink";
import { Button } from "@components/ui/Button";
import Spinner from "@components/ui/Spinner";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/Table";
import { AllocationType } from "@farther/backend";
import { useUser } from "@lib/context/UserContext";
import { removeFalsyValues } from "@lib/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React from "react";

export default function RewardsPage() {
  const { account, user, userIsLoading } = useUser();

  const powerDrop = user?.allocations?.find(
    (a) => a.type === AllocationType.POWER_USER,
  );
  const evangelistRows = user?.allocations?.filter(
    (a) => a.type === AllocationType.EVANGELIST,
  );
  const evangelistPendingRows =
    evangelistRows?.filter((a) => !a.airdrop?.address) || [];
  const evangelistPendingRow = evangelistPendingRows.length
    ? evangelistPendingRows.reduce((acc, a, i) => {
        if (!acc) return a;
        return {
          ...acc,
          amount: (BigInt(acc.amount) + BigInt(a.amount)).toString(),
          aggregate: i + 1,
        };
      })
    : null;

  const evangelistClaimedRows =
    evangelistRows?.filter((a) => a.isClaimed) || [];
  const evangelistClaimedRow = evangelistClaimedRows.length
    ? evangelistClaimedRows.reduce((acc, a, i) => {
        if (!acc) return a;
        return {
          ...acc,
          amount: (BigInt(acc.amount) + BigInt(a.amount)).toString(),
          aggregate: i + 1,
        };
      })
    : null;

  const rows = removeFalsyValues([
    powerDrop,
    evangelistPendingRow,
    evangelistClaimedRow,
  ]);

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
            ) : rows.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-0">Type</TableHead>
                    <TableHead className="pr-1 text-right">Amount</TableHead>
                    <TableHead className="text-left"></TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((a) => (
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
