import { InfoCard } from "@components/InfoCard";
import { NoUserFoundCard } from "@components/NoUserFoundCard";
import { Button } from "@components/ui/Button";
import { Skeleton } from "@components/ui/Skeleton";
import { clickIds } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import dayjs from "dayjs";
import { useTipsMeta } from "hooks/useTipsMeta";

export const dynamic = "force-dynamic";

export function TipsUserInfo() {
  const { createdAt } = useTipsMeta();
  const { account, user, userIsLoading } = useUser();
  const { openConnectModal } = useConnectModal();

  const allowance = user?.tipAllowance?.amount || 0;
  const spentAllowance =
    user?.tipAllowance?.tips.reduce((acc, t) => t.amount + acc, 0) || 0;
  const remainingAllowance = allowance - spentAllowance;

  return (
    <>
      {userIsLoading ? (
        <>
          <Skeleton className="mt-8 h-[140px]" />
          <Skeleton className="mt-8 h-[140px]" />
        </>
      ) : user ? (
        <>
          <h4 className="text-ghost mt-8 text-sm uppercase">
            {createdAt ? dayjs(new Date(createdAt)).format("MMM D") : ""}
            &nbsp;Cycle
          </h4>
          <InfoCard className="mt-0 w-full">
            <div className="flex flex-col justify-between md:flex-row">
              <div className="grid grid-cols-[100px_200px] gap-2">
                <span className="text-muted font-bold md:text-lg">
                  Allowance
                </span>
                <span className="font-bold md:text-lg">
                  {allowance.toLocaleString()} ✨
                </span>
                <span className="text-muted">Given</span>
                <span>
                  {spentAllowance.toLocaleString()} ✨{" "}
                  <span className="text-ghost">
                    ({user.tipAllowance?.tips.length} tips)
                  </span>
                </span>
                <span className="text-muted">Remaining</span>
                <span>{remainingAllowance.toLocaleString()} ✨</span>
              </div>
              <div className="mt-6 grid grid-cols-[100px_200px] gap-2 md:mt-0">
                <span className="text-muted font-bold md:text-lg">
                  Received
                </span>
                <span className="font-bold md:text-lg">
                  {user.latestTipsReceived.amount.toLocaleString()} ✨{" "}
                  <span className="text-ghost">
                    ({user.latestTipsReceived.number} tips)
                  </span>
                </span>
              </div>
            </div>
          </InfoCard>
          <h4 className="text-ghost mt-8 text-sm">TOTALS</h4>
          <InfoCard className="mt-0 w-full">
            <div className="flex flex-col justify-between md:flex-row">
              <div className="grid grid-cols-[100px_200px] gap-2">
                <span className="text-muted font-bold md:text-lg">Given</span>
                <span className="font-bold md:text-lg">
                  {user.totalTipsGiven.amount.toLocaleString()} ✨{" "}
                  <span className="text-ghost">
                    ({user.totalTipsGiven.number} tips)
                  </span>
                </span>
              </div>
              <div className="mt-2 grid grid-cols-[100px_200px] gap-2 md:mt-0">
                <span className="text-muted font-bold md:text-lg">
                  Received
                </span>
                <span className="font-bold md:text-lg">
                  {user.totalTipsReceived.amount.toLocaleString()} ✨{" "}
                  <span className="text-ghost">
                    ({user.totalTipsReceived.number} tips)
                  </span>
                </span>
              </div>
            </div>
          </InfoCard>
        </>
      ) : !account.address ? (
        <InfoCard className="text-center" variant="ghost">
          <Button
            sentryId={clickIds.tipsUserInfoConnectWallet}
            variant="link"
            onClick={openConnectModal}
          >
            Connect your wallet
          </Button>
          &nbsp; to see your tips info.
        </InfoCard>
      ) : (
        <NoUserFoundCard />
      )}
    </>
  );
}
