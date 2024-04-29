import { InfoCard } from "@components/InfoCard";
import { NoUserFoundCard } from "@components/NoUserFoundCard";
import { RewardsTableRow } from "@components/RewardsTableRow";
import { FartherChannelLink } from "@components/nav/FartherChannelLink";
import { Button } from "@components/ui/Button";
import { Container } from "@components/ui/Container";
import Spinner from "@components/ui/Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/Table";
import { AllocationType } from "@farther/backend";
import { ROUTES } from "@lib/constants";
import { useLiquidity } from "@lib/context/LiquidityContext";
import { useUser } from "@lib/context/UserContext";
import { formatWad, removeFalsyValues } from "@lib/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import React from "react";

export default function RewardsPage() {
  const { account, user, userIsLoading } = useUser();
  const router = useRouter();
  const { positions, claimedRewards } = useLiquidity();

  const powerDrop = user?.allocations?.find(
    (a) => a.type === AllocationType.POWER_USER,
  );
  const evangelistRows = user?.allocations?.filter(
    (a) => a.type === AllocationType.EVANGELIST,
  );
  const evangelistPendingRow = (evangelistRows?.filter(
    (a) => !a.airdrop?.address,
  ) || [])[0];

  const evangelistClaimedRows =
    evangelistRows?.filter((a) => a.isClaimed) || [];

  const rows = removeFalsyValues([
    powerDrop,
    evangelistPendingRow,
    ...evangelistClaimedRows,
  ]);

  const { openConnectModal } = useConnectModal();
  return (
    <Container variant="page">
      <main className="content">
        <h1>Rewards</h1>
        {userIsLoading ? (
          <Spinner variant="page" />
        ) : (
          <>
            <p>All your Farther token rewards are summarized below</p>
            <div className="mt-8">
              {!account.isConnected ? (
                <InfoCard className="text-center">
                  Please{" "}
                  <Button variant="link" onClick={openConnectModal}>
                    connect your wallet
                  </Button>{" "}
                  to check if you have any rewards.
                </InfoCard>
              ) : rows.length || claimedRewards > BigInt(0) ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-0">Type</TableHead>
                      <TableHead className="pr-1 text-right">Amount</TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((a) => (
                      <RewardsTableRow key={a.id} allocation={a} />
                    ))}
                    {positions?.length && (
                      <TableRow>
                        <TableCell className="pl-0 font-medium">
                          Liquidity
                        </TableCell>
                        <TableCell className="pr-1 text-right">
                          {formatWad(
                            positions
                              .reduce(
                                (acc, pos) =>
                                  acc + BigInt(pos.unclaimedRewards),
                                BigInt(0),
                              )
                              .toString(),
                          )}
                        </TableCell>
                        <TableCell className="pr-0 text-right">
                          <Button
                            className="w-[80px]"
                            onClick={() => router.push(ROUTES.liquidty.path)}
                          >
                            Unstake
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                    {claimedRewards > BigInt(0) && (
                      <TableRow>
                        <TableCell className="pl-0 font-medium">
                          Liquidity
                        </TableCell>
                        <TableCell className="pr-1 text-right">
                          {formatWad(claimedRewards.toString())}
                        </TableCell>
                        <TableCell className="pr-0 text-right">
                          <Button className="w-[80px]" disabled={true}>
                            Claimed
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : !user ? (
                <NoUserFoundCard />
              ) : (
                <InfoCard variant="muted">
                  No rewards found. If you believe this is an error, please
                  reach out in the <FartherChannelLink />.
                </InfoCard>
              )}
            </div>
          </>
        )}
      </main>
    </Container>
  );
}
