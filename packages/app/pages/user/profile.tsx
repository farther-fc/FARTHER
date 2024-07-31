import { InfoCard } from "@components/InfoCard";
import { RewardsTableRow } from "@components/RewardsTableRow";
import { FartherAccountLink } from "@components/nav/FartherLinks";
import { TipsUserInfo } from "@components/tips/TipsUserInfo";
import { Button } from "@components/ui/Button";
import { Container } from "@components/ui/Container";
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
import { clickIds } from "@lib/constants";
import { useLiquidity } from "@lib/context/LiquidityContext";
import { useUser } from "@lib/context/UserContext";
import { routes } from "@lib/routes";
import { formatWad, removeFalsyValues } from "@lib/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useLiquidityHandlers } from "hooks/useLiquidityHandlers";
import Link from "next/link";

export default function ProfilePage() {
  const { accountAddress, user, userLoading } = useUser();
  const { handleClaimRewards, claimSuccess, claimPending } =
    useLiquidityHandlers();
  const {
    claimableRewards,
    rewardsClaimed,
    pendingBonus,
    bonusLpRewardsDropDate,
  } = useLiquidity();

  const rows = removeFalsyValues(user?.allocations || []);

  if (pendingBonus > BigInt(0)) {
    rows.push({
      id: "PENDING_POWER_ALLOCATION_ID",
      type: AllocationType.LIQUIDITY,
      isClaimed: false,
      createdAt: bonusLpRewardsDropDate,
      amount: pendingBonus.toString(),
      address: accountAddress || "",
      index: null,
      airdrop: null,
      baseAmount: "",
      referenceAmount: null,
      tweets: [],
    });
  }

  const { openConnectModal } = useConnectModal();

  const powerdropHasUpcomingAirdrop = rows.some(
    (a) =>
      a.type === AllocationType.POWER_USER &&
      a.airdrop &&
      new Date(a.airdrop.startTime) > new Date(),
  );
  const evangelistHasUpcomingAirdrop = rows.some(
    (a) =>
      a.type === AllocationType.EVANGELIST &&
      a.airdrop &&
      new Date(a.airdrop.startTime) > new Date(),
  );
  const lpHasUpcomingAirdrop = rows.some(
    (a) =>
      a.type === AllocationType.LIQUIDITY &&
      a.airdrop &&
      new Date(a.airdrop.startTime) > new Date(),
  );
  const tipsHasUpcomingAirdrop = rows.some(
    (a) =>
      a.type === AllocationType.TIPS &&
      a.airdrop &&
      new Date(a.airdrop.startTime) > new Date(),
  );

  const now = new Date();

  const unclaimedRewards = rows
    .filter((a) => !a.isClaimed && a.airdrop)
    .sort((a, b) => {
      if (
        new Date(a.airdrop?.startTime || 0) < now &&
        new Date(b.airdrop?.startTime || 0) > now
      ) {
        return -1;
      }
      if (
        new Date(a.airdrop?.startTime || 0) > now &&
        new Date(b.airdrop?.startTime || 0) < now
      ) {
        return 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  const pendingRewards = rows
    .filter((a) => !a.isClaimed && !a.airdrop)
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  const claimedRewards = rows
    .filter((a) => a.isClaimed)
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <Container variant="page">
      <main className="content">
        <h1>Profile</h1>
        <div className="border-ghost mt-12 rounded-xl">
          <h2 className="mt-0 border-none pl-0">Tips</h2>
          <p className="text-muted mb-4">
            Visit the <Link href={routes.tips.path}>tips page</Link> to learn
            how tipping works.
          </p>
          <TipsUserInfo />
        </div>
        <div className="border-ghost mt-12 rounded-xl">
          <h2 className="mt-0 border-none pl-0">
            Rewards <span className="font-thin">(Airdrops)</span>
          </h2>
          {userLoading ? (
            <Skeleton className="h-[200px]" />
          ) : (
            <>
              {!accountAddress ? (
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
                      {/** CLAIMABLE ONCHAIN LIQUDITY REWARDS */}
                      {claimableRewards > BigInt(0) && (
                        <TableRow>
                          <TableCell className="pl-0 font-medium">
                            <Link href={routes.liquidity.path}>
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
                      {unclaimedRewards.map((a) => (
                        <RewardsTableRow
                          key={a.id}
                          allocation={a}
                          allocTypeHasUpcomingAirdrop={
                            a.type === AllocationType.POWER_USER
                              ? powerdropHasUpcomingAirdrop
                              : a.type === AllocationType.TIPS
                                ? tipsHasUpcomingAirdrop
                                : a.type === AllocationType.EVANGELIST
                                  ? evangelistHasUpcomingAirdrop
                                  : a.type === AllocationType.LIQUIDITY
                                    ? lpHasUpcomingAirdrop
                                    : false
                          }
                        />
                      ))}
                      {pendingRewards.map((a) => (
                        <RewardsTableRow
                          key={a.id}
                          allocation={a}
                          allocTypeHasUpcomingAirdrop={
                            a.type === AllocationType.POWER_USER
                              ? powerdropHasUpcomingAirdrop
                              : a.type === AllocationType.TIPS
                                ? tipsHasUpcomingAirdrop
                                : a.type === AllocationType.EVANGELIST
                                  ? evangelistHasUpcomingAirdrop
                                  : a.type === AllocationType.LIQUIDITY
                                    ? lpHasUpcomingAirdrop
                                    : false
                          }
                        />
                      ))}
                      {claimedRewards.map((a) => (
                        <RewardsTableRow
                          key={a.id}
                          allocation={a}
                          allocTypeHasUpcomingAirdrop={false}
                        />
                      ))}
                      {/** CLAIMED ONCHAIN LIQUDITY REWARDS */}
                      {rewardsClaimed && (
                        <TableRow>
                          <TableCell className="pl-0 font-medium">
                            <Link href={routes.liquidity.path}>
                              Liquidity (onchain)
                            </Link>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell className="pr-1 text-right">
                            {formatWad(BigInt(rewardsClaimed))}
                          </TableCell>
                          <TableCell className="pr-0 text-right">
                            <Button
                              sentryId={clickIds.profilePageClaim}
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
