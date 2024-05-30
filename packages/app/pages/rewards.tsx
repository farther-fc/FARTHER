import { InfoCard } from "@components/InfoCard";
import LiquidityBonusRewardsPopover from "@components/LiquidityBonusRewardsPopover";
import { PendingRewardButton } from "@components/PendingRewardButton";
import { RewardsTableRow } from "@components/RewardsTableRow";
import { FartherAccountLink } from "@components/nav/FartherLinks";
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
import { getStartOfMonthUTC } from "@farther/common";
import { ROUTES, clickIds } from "@lib/constants";
import { useLiquidity } from "@lib/context/LiquidityContext";
import { useUser } from "@lib/context/UserContext";
import { formatAirdropTime, formatWad, removeFalsyValues } from "@lib/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useLiquidityHandlers } from "hooks/useLiquidityHandlers";
import { Info } from "lucide-react";
import Link from "next/link";

export default function RewardsPage() {
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
        <h1>Rewards</h1>
        {userIsLoading ? (
          <Spinner variant="page" />
        ) : (
          <>
            {!account.isConnected ? (
              <InfoCard className="text-center">
                Please{" "}
                <Button
                  sentryId={clickIds.rewardsPageConnectWallet}
                  variant="link"
                  onClick={openConnectModal}
                >
                  connect your wallet
                </Button>{" "}
                to check if you have any rewards.
              </InfoCard>
            ) : rows.length ||
              claimableRewards > BigInt(0) ||
              typeof rewardsClaimed === "string" ? (
              <div className="mt-8">
                <p className="text-muted">
                  Snapshots for airdrops take place up to a week before the end
                  of the month. If you don't become eligible for one before
                  then, you can still become eligible for the next airdrop.
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
                      <TableHead className="pr-1 text-right">Amount</TableHead>
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
                      .filter((a) => a.type === AllocationType.EVANGELIST)
                      .map((a) => (
                        <RewardsTableRow key={a.id} allocation={a} />
                      ))}
                    {/* {rows
                      .filter((a) => a.type === AllocationType.LIQUIDITY)
                      .map((a) => (
                        <RewardsTableRow key={a.id} allocation={a} />
                      ))} */}
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
              <InfoCard variant="ghost">
                No rewards found. If you believe this is an error, please{" "}
                <FartherAccountLink>reach out for help</FartherAccountLink>.
              </InfoCard>
            )}
          </>
        )}
      </main>
    </Container>
  );
}

export function getStaticProps() {
  return {
    props: {
      seo: {
        title: "Rewards",
      },
    },
  };
}
