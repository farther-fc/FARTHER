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
import { AllocationType } from "@farther/backend";
import {
  IS_INCENTIVE_PROGRAM_ACTIVE,
  LIQUIDITY_BONUS_MULTIPLIER,
  getStartOfNextMonthUTC,
} from "@farther/common";
import { ROUTES, clickIds } from "@lib/constants";
import { useLiquidity } from "@lib/context/LiquidityContext";
import { useUser } from "@lib/context/UserContext";
import { formatAirdropTime, formatWad } from "@lib/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useLiquidityHandlers } from "hooks/useLiquidityHandlers";
import { Info } from "lucide-react";
import Link from "next/link";

export default function LiquidityPage() {
  const { account, user } = useUser();
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

  const liquidityBonusAllocations = user?.allocations.filter(
    (a) => a.type === AllocationType.LIQUIDITY,
  );

  const claimedBonusAllocations =
    user?.allocations.filter((a) => a.isClaimed) || [];

  // This is the total amount of liqudity rewards that have received an airdropped bonus
  // which has already been claimed
  const claimedReferenceAmount = claimedBonusAllocations.reduce(
    (acc, curr) => BigInt(curr.referenceAmount || "0") + acc,
    BigInt(0),
  );

  const pendingBonusRewards =
    (BigInt(rewardsClaimed) - claimedReferenceAmount) *
    BigInt(LIQUIDITY_BONUS_MULTIPLIER);

  return (
    <Container variant="page">
      <main className="content">
        <LiquidityInfo />
        <div className="mt-16">
          <div className="mb-4 flex flex-col items-start justify-between md:flex-row">
            <h2 className="mt-0">Positions</h2>
            <div className="border-ghost mb-12 flex w-full justify-between rounded-xl border p-4 md:w-auto md:space-x-8">
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
                          calculated by adding up all the claimed rewards during
                          the month & multiplying by{" "}
                          {LIQUIDITY_BONUS_MULTIPLIER}.
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
                      {formatWad(pendingBonusRewards)}
                    </div>
                  )}
                </div>
                {pendingBonusRewards > BigInt(0) && (
                  <Button
                    className="ml-auto mt-2 w-40"
                    variant="secondary"
                    sentryId={clickIds.liquidityPendingBonus}
                    disabled={true}
                  >
                    Available {formatAirdropTime(getStartOfNextMonthUTC())}
                  </Button>
                )}
              </div>
              {liquidityBonusAllocations?.length ? (
                <div>
                  <div className="mb-4 flex flex-col">
                    <div className="flex justify-between">Claimable Bonus</div>
                    <div className="text-link">
                      {formatWad(
                        liquidityBonusAllocations.reduce(
                          (acc, curr) => BigInt(curr.amount) + acc,
                          BigInt(0),
                        ),
                      )}
                    </div>
                  </div>
                  <Link href={ROUTES.rewards.path}>
                    <Button
                      className="ml-auto mt-2 w-40"
                      variant="secondary"
                      sentryId={clickIds.liquidityClaimableBonus}
                    >
                      Claim
                    </Button>
                  </Link>
                </div>
              ) : null}
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
