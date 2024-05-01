import { InfoCard } from "@components/InfoCard";
import { LiquidityInfo } from "@components/LiquidityInfo";
import { LiquidityTableRow } from "@components/LiquidityTableRow";
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
import { IS_INCENTIVE_PROGRAM_ACTIVE } from "@farther/common";
import { clickIds } from "@lib/constants";
import { useLiquidity } from "@lib/context/LiquidityContext";
import { useUser } from "@lib/context/UserContext";
import { formatWad } from "@lib/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export default function LiquidityPage() {
  const { account } = useUser();
  const { openConnectModal } = useConnectModal();
  const { positions, positionsLoading, claimedRewards } = useLiquidity();

  return (
    <Container variant="page">
      <main className="content">
        <LiquidityInfo />
        <div className="mt-10">
          <h2 className="flex items-end justify-between ">
            <div className="!leading-tight">Positions</div>{" "}
          </h2>
          <div className="flex justify-end">
            <div className="rounded-lg border px-4 py-1 !leading-normal">
              Claimed rewards:{" "}
              <span className="text-link">
                {formatWad(claimedRewards.toString())}
              </span>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-0">Position ID</TableHead>
                <TableHead className="text-right">Rewards</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {account.address && positions?.length ? (
                positions.map((position) => (
                  <LiquidityTableRow key={position.id} position={position} />
                ))
              ) : (
                <TableRow>
                  <TableCell className="px-0" colSpan={3}>
                    {!account.address ? (
                      <InfoCard className="text-center">
                        <Button
                          sentryId={clickIds.liquidtyPageConnectWallet}
                          variant="link"
                          onClick={openConnectModal}
                        >
                          Connect your wallet
                        </Button>{" "}
                        to stake your liquidity for rewards.
                      </InfoCard>
                    ) : !IS_INCENTIVE_PROGRAM_ACTIVE ? (
                      <InfoCard variant="muted" className="content text-center">
                        The liquidity incentive program is not yet active
                      </InfoCard>
                    ) : positionsLoading ? (
                      <InfoCard className="flex justify-center">
                        <Spinner />
                      </InfoCard>
                    ) : (
                      !positions?.length && (
                        <InfoCard
                          variant="muted"
                          className="content text-center"
                        >
                          No liquidity positions found
                        </InfoCard>
                      )
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </Container>
  );
}

export function getStaticProps() {
  return {
    props: {
      seo: {
        title: "Liquidity",
      },
    },
  };
}
