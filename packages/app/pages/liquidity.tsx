import { InfoCard } from "@components/InfoCard";
import { LiquidityInfo } from "@components/LiquidityInfo";
import { LiquidityTableRow } from "@components/LiquidityTableRow";
import { Button } from "@components/ui/Button";
import { Container } from "@components/ui/Container";
import { Popover } from "@components/ui/Popover";
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
import { useLiquidityHandlers } from "hooks/useLiquidityHandlers";
import { Info } from "lucide-react";

export default function LiquidityPage() {
  const { account } = useUser();
  const { openConnectModal } = useConnectModal();
  const { claimPending, handleClaimRewards, claimSuccess } =
    useLiquidityHandlers();
  const {
    positions,
    indexerDataLoading,
    claimableRewards,
    claimableRewardsLoading,
    rewardsClaimed,
  } = useLiquidity();

  return (
    <Container variant="page">
      <main className="content">
        <LiquidityInfo />
        <div className="mt-16">
          <div className="mb-4 flex flex-col items-start justify-between md:flex-row">
            <h2 className="mt-0">Positions</h2>
            <div className="border-ghost mb-12 flex w-full justify-between rounded-xl border p-4 md:w-auto md:space-x-14">
              <div className="">
                <div className="mb-4 flex flex-col">
                  Claimable Rewards
                  {claimableRewardsLoading ? (
                    <Spinner className="mt-1" size="xs" />
                  ) : (
                    <div className="text-link">
                      {formatWad(claimableRewards)}
                    </div>
                  )}
                </div>
                <Button
                  className="ml-auto mt-2 w-40"
                  variant="secondary"
                  sentryId={clickIds.claimLiquidityRewards}
                  onClick={() => handleClaimRewards()}
                  disabled={
                    claimSuccess ||
                    claimPending ||
                    claimableRewards === BigInt(0)
                  }
                  loading={claimPending}
                  loadingText="Claiming"
                >
                  Claim
                </Button>
              </div>
              <div>
                <div className="mb-4 flex flex-col">
                  <div className="flex justify-between">
                    <Popover
                      content={
                        <>
                          Bonus rewards are airdropped monthly. They're
                          calculated by adding up all the claimed rewards since
                          the last bonus rewards airdrop snapshot & multiplying
                          by two.
                        </>
                      }
                    >
                      <div>
                        Pending Bonus
                        <Info className="ml-2 inline w-4" />
                      </div>
                    </Popover>
                  </div>
                  {indexerDataLoading ? (
                    <Spinner className="mt-1" size="xs" />
                  ) : (
                    <div className="text-link">
                      {formatWad(BigInt(rewardsClaimed) * BigInt(2))}
                    </div>
                  )}
                </div>
                <Button
                  className="ml-auto mt-2 w-40"
                  variant="secondary"
                  sentryId={clickIds.claimLiquidityRewards}
                  onClick={() => handleClaimRewards()}
                  disabled={
                    claimSuccess ||
                    claimPending ||
                    claimableRewards === BigInt(0)
                  }
                  loading={claimPending}
                  loadingText="Claiming"
                >
                  Claim
                </Button>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-0">Position ID</TableHead>
                <TableHead className="text-right">Pending Rewards</TableHead>
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
                    ) : indexerDataLoading ? (
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
