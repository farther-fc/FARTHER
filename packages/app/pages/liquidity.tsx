import { InfoCard } from "@components/InfoCard";
import { LiquidityInfo } from "@components/LiquidityInfo";
import { LiquidityTableRow } from "@components/LiquidityTableRow";
import { BonusRewardsModal } from "@components/modals/BonusRewardsModal";
import { Button } from "@components/ui/Button";
import { Container } from "@components/ui/Container";
import { ExternalLink } from "@components/ui/ExternalLink";
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
import {
  DUST_AMOUNT,
  IS_INCENTIVE_PROGRAM_ACTIVE,
  LIQUIDITY_BONUS_MULTIPLIER,
  getStartOfNextMonthUTC,
} from "@farther/common";
import { POWER_BADGE_INFO_URL, ROUTES, clickIds } from "@lib/constants";
import { useLiquidity } from "@lib/context/LiquidityContext";
import { useModal } from "@lib/context/ModalContext";
import { useUser } from "@lib/context/UserContext";
import { formatAirdropTime, formatWad } from "@lib/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useLiquidityHandlers } from "hooks/useLiquidityHandlers";
import { Info } from "lucide-react";
import Link from "next/link";

export default function LiquidityPage() {
  const { account, user } = useUser();
  const { openModal } = useModal();
  const { openConnectModal } = useConnectModal();
  const { claimPending, handleClaimRewards, claimSuccess } =
    useLiquidityHandlers();
  const {
    positions,
    indexerDataLoading,
    claimableRewards,
    claimableRewardsLoading,
    rewardsClaimed,
    pendingBonusAmount,
    claimableBonusAmount,
    unclaimedBonusAllocations,
  } = useLiquidity();

  return (
    <Container variant="page">
      <main className="content">
        <LiquidityInfo />
        <div className="mt-16">
          <h2 className="mt-0">Positions</h2>
          <div className="mb-12 grid grid-cols-1 items-start justify-between gap-8 md:grid-cols-2 md:flex-row">
            <div className="border-ghost w-full justify-between rounded-xl border p-4">
              <Popover
                content={
                  <>
                    The onchain rewards program is permissionless. A Farcaster
                    account is not required.
                  </>
                }
              >
                <h3 className="mt-0 border-none pl-0 text-center text-lg">
                  Onchain Rewards
                  <Info className="ml-2 inline w-4" />
                </h3>
              </Popover>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-4 flex flex-col">
                    Claimed{" "}
                    {indexerDataLoading ? (
                      <Spinner className="mt-1" size="xs" />
                    ) : (
                      <div className="text-link">
                        {formatWad(BigInt(rewardsClaimed || "0"))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="">
                  <div className="mb-4 flex flex-col justify-center">
                    Claimable
                    {claimableRewardsLoading ? (
                      <Spinner className="mt-1" size="xs" />
                    ) : (
                      <div
                        className={`text-link ${claimableRewards > DUST_AMOUNT ? "font-bold" : "font-normal"}`}
                      >
                        {formatWad(claimableRewards)}
                      </div>
                    )}
                  </div>
                  <Button
                    className="ml-auto mt-2 w-full"
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
            <div className="border-ghost w-full rounded-xl border p-4 ">
              <Popover
                content={
                  <>
                    Bonus rewards are airdropped monthly to liquidity providers
                    who have a{" "}
                    <ExternalLink href={POWER_BADGE_INFO_URL}>
                      Warpcast Power Badge
                    </ExternalLink>
                    . They're calculated by adding up all the claimed onchain
                    rewards during the month & multiplying by{" "}
                    {LIQUIDITY_BONUS_MULTIPLIER}.{" "}
                    <Button
                      sentryId={clickIds.liquidityInfoBonusRewards}
                      onClick={() =>
                        openModal({
                          headerText: "Liquidity bonus rewards",
                          body: <BonusRewardsModal />,
                        })
                      }
                      variant="link"
                    >
                      Learn more✨
                    </Button>
                  </>
                }
              >
                <h3 className="mt-0 border-none pl-0 text-center text-lg">
                  Bonus Rewards
                  <Info className="ml-2 inline w-4" />
                </h3>
              </Popover>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-4 flex flex-col">
                    Pending
                    {indexerDataLoading ? (
                      <Spinner className="mt-1" size="xs" />
                    ) : (
                      <div className="text-link">
                        {formatWad(pendingBonusAmount)}
                      </div>
                    )}
                  </div>

                  <Button
                    className="ml-auto mt-2 w-full"
                    variant="secondary"
                    sentryId={clickIds.liquidityPendingBonus}
                    disabled={true}
                  >
                    {pendingBonusAmount === BigInt(0) ? (
                      "Pending"
                    ) : (
                      <>
                        Available {formatAirdropTime(getStartOfNextMonthUTC())}
                      </>
                    )}
                  </Button>
                </div>
                <div>
                  <div className="mb-4 flex flex-col">
                    <div className="flex justify-between">Claimable</div>
                    <div
                      className={`text-link ${claimableBonusAmount > DUST_AMOUNT ? "font-bold" : "font-normal"}`}
                    >
                      {formatWad(claimableBonusAmount)}
                    </div>
                  </div>
                  {/** Button link to rewards page */}
                  {unclaimedBonusAllocations.length ? (
                    <Link href={ROUTES.rewards.path}>
                      <Button
                        className="ml-auto mt-2 w-full"
                        variant="secondary"
                        sentryId={clickIds.liquidityClaimableBonus}
                      >
                        Claim
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className="ml-auto mt-2 w-full"
                      variant="secondary"
                      sentryId={clickIds.liquidityClaimableBonus}
                      disabled={true}
                    >
                      Claim
                    </Button>
                  )}
                </div>
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
                      <InfoCard className="text-center" variant="ghost">
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
                      <InfoCard variant="ghost" className="content text-center">
                        The liquidity incentive program is not yet active
                      </InfoCard>
                    ) : indexerDataLoading ? (
                      <InfoCard className="flex justify-center">
                        <Spinner />
                      </InfoCard>
                    ) : (
                      !positions?.length && (
                        <InfoCard
                          variant="ghost"
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
