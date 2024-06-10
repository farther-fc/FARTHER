import { InfoCard } from "@components/InfoCard";
import LiquidityBonusRewardsPopover from "@components/LiquidityBonusRewardsPopover";
import { PendingRewardButton } from "@components/PendingRewardButton";
import { RewardsTableRow } from "@components/RewardsTableRow";
import { FartherAccountLink } from "@components/nav/FartherLinks";
import { TipsUserInfo } from "@components/tips/TipsUserInfo";
import { Button } from "@components/ui/Button";
import { Container } from "@components/ui/Container";
import { Popover } from "@components/ui/Popover";
import { Skeleton } from "@components/ui/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/Table";
import { AllocationType } from "@farther/backend";
import { getStartOfMonthUTC } from "@farther/common";
import { ROUTES, clickIds } from "@lib/constants";
import { useLiquidity } from "@lib/context/LiquidityContext";
import { useUser } from "@lib/context/UserContext";
import { formatAirdropTime, formatWad, removeFalsyValues } from "@lib/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useLiquidityHandlers } from "hooks/useLiquidityHandlers";
import { Info } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { account, user, userIsLoading } = useUser();
  const { handleClaimRewards, claimSuccess, claimPending } =
    useLiquidityHandlers();
  const {
    claimableRewards,
    rewardsClaimed,
    pendingBonusAmount,
    hasCurrentCycleBeenAirdropped,
  } = useLiquidity();

  const rows = removeFalsyValues(user?.allocations || []);

  const { openConnectModal } = useConnectModal();

  const bonusLiqDropDate = formatAirdropTime(
    getStartOfMonthUTC(hasCurrentCycleBeenAirdropped ? 2 : 1),
  );

  return (
    <Container variant="page">
      <main className="content">
        <h1>Profile</h1>
        <div className="border-ghost mt-12 rounded-xl">
          <h2 className="mt-0 border-none pl-0">Tips</h2>
          <p className="text-muted mb-4">
            Visit the <Link href={ROUTES.tips.path}>tips page</Link> to learn
            how tipping works.
          </p>
          <TipsUserInfo />
        </div>
        <div className="border-ghost my-20 rounded-xl">
          <h2 className="mt-0 border-none pl-0">
            Rewards <span className="font-thin">(Airdrops)</span>
          </h2>
          {userIsLoading ? (
            <Skeleton className="h-[200px]" />
          ) : (
            <>
              {!account.isConnected ? (
                <InfoCard className="text-center" variant="ghost">
                  <Button
                    sentryId={clickIds.rewardsPageConnectWallet}
                    variant="link"
                    onClick={openConnectModal}
                  >
                    Connect your wallet
                  </Button>{" "}
                  <span className="whitespace-nowrap">
                    to see your rewards.
                  </span>
                </InfoCard>
              ) : rows.length ||
                claimableRewards > BigInt(0) ||
                typeof rewardsClaimed === "string" ? (
                <div className="mt-8">
                  <p className="text-muted">
                    Snapshots for airdrops take place up to a week before the
                    end of the month.
                  </p>
                  <Table className="mt-12">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px] pl-0 md:w-auto">
                          Category
                        </TableHead>
                        <TableHead className="w-[60px] pl-0 text-right md:w-auto">
                          Date
                        </TableHead>
                        <TableHead className="pr-1 text-right">
                          Amount
                        </TableHead>
                        <TableHead className="text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows
                        .filter((a) => a.type === AllocationType.POWER_USER)
                        .map((a) => (
                          <RewardsTableRow key={a.id} allocation={a} />
                        ))}
                      {rows
                        .filter((a) => a.type === AllocationType.TIPS)
                        .map((a) => (
                          <RewardsTableRow key={a.id} allocation={a} />
                        ))}
                      {rows
                        .filter((a) => a.type === AllocationType.EVANGELIST)
                        .map((a) => (
                          <RewardsTableRow key={a.id} allocation={a} />
                        ))}
                      {rows
                        .filter((a) => a.type === AllocationType.LIQUIDITY)
                        .map((a) => (
                          <RewardsTableRow key={a.id} allocation={a} />
                        ))}
                      {/** CLAIMABLE ONCHAIN LIQUDITY REWARDS */}
                      {claimableRewards > BigInt(0) && (
                        <TableRow>
                          <TableCell className="pl-0 font-medium">
                            <Link href={ROUTES.liquidty.path}>
                              Liquidity (onchain rewards)
                            </Link>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell className="pr-1 text-right">
                            {formatWad(claimableRewards)}
                          </TableCell>
                          <TableCell className="pr-0 text-right">
                            <Button
                              className="w-tableButton md:w-tableButtonWide ml-auto mt-2"
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
                          </TableCell>
                        </TableRow>
                      )}
                      {/** PENDING BONUS LIQUDITY REWARDS */}
                      {pendingBonusAmount > BigInt(0) && (
                        <TableRow>
                          <TableCell className="pl-0 font-medium">
                            <Link href={ROUTES.liquidty.path}>
                              Liquidity (bonus)
                            </Link>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatAirdropTime(
                              getStartOfMonthUTC(
                                hasCurrentCycleBeenAirdropped ? 2 : 1,
                              ),
                            )}
                          </TableCell>
                          <TableCell className="pr-1 text-right">
                            <Popover content={<LiquidityBonusRewardsPopover />}>
                              <div className="flex items-center justify-end">
                                {formatWad(pendingBonusAmount)}{" "}
                                <Info className="ml-1 w-3" />
                              </div>
                            </Popover>
                          </TableCell>
                          <TableCell className="pr-0 text-right">
                            {user?.powerBadge ? (
                              <Button
                                sentryId={clickIds.rewardsPageClaimedRewards}
                                className="w-tableButton md:w-tableButtonWide"
                                disabled={true}
                              >
                                Avail. {bonusLiqDropDate}
                              </Button>
                            ) : (
                              <PendingRewardButton />
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                      {/** CLAIMED ONCHAIN LIQUDITY REWARDS */}
                      {rewardsClaimed && (
                        <TableRow>
                          <TableCell className="pl-0 font-medium">
                            <Link href={ROUTES.liquidty.path}>
                              Liquidity (onchain)
                            </Link>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell className="pr-1 text-right">
                            {formatWad(BigInt(rewardsClaimed))}
                          </TableCell>
                          <TableCell className="pr-0 text-right">
                            <Button
                              sentryId={clickIds.rewardsPageClaim}
                              className="w-tableButton md:w-tableButtonWide"
                              disabled={true}
                            >
                              Claimed
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <InfoCard variant="ghost" className="flex justify-center">
                  No rewards found. If you believe this is an error,
                  please&nbsp;
                  <FartherAccountLink>reach out for help</FartherAccountLink>.
                </InfoCard>
              )}
            </>
          )}
        </div>
      </main>
    </Container>
  );
}

export function getStaticProps() {
  return {
    props: {
      seo: {
        title: "Profile",
      },
    },
  };
}
