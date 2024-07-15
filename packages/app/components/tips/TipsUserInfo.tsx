import { InfoCard } from "@components/InfoCard";
import { NoUserFoundCard } from "@components/NoUserFoundCard";
import { Button } from "@components/ui/Button";
import { Popover } from "@components/ui/Popover";
import { Skeleton } from "@components/ui/Skeleton";
import { TIPPER_REQUIRED_FARTHER_BALANCE } from "@farther/common";
import { clickIds } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import dayjs from "dayjs";
import { useTipsMeta } from "hooks/useTipsMeta";
import { AlertCircle } from "lucide-react";

export function TipsUserInfo() {
  const { createdAt } = useTipsMeta();
  const { accountAddress, user, userIsLoading } = useUser();
  const { openConnectModal } = useConnectModal();

  return (
    <div className="mb-14">
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
                  {user.currentAllowance.amount.toLocaleString()}{" "}
                  {user.currentAllowance.amount > 0 && "✨"}
                </span>
                <span className="text-muted">Given</span>
                <span>
                  {user.currentAllowance.spent.toLocaleString()}{" "}
                  {user.currentAllowance.spent > 0 && "✨"}{" "}
                  <span className="text-ghost">
                    ({user.currentAllowance.tipsGiven} tips)
                  </span>
                </span>
                {user.currentAllowance.invalidatedAmount ? (
                  <>
                    {" "}
                    <span className="text-muted text-red-400">Voided</span>
                    <div className="flex text-red-400">
                      {user.currentAllowance.invalidatedAmount.toLocaleString()}
                      <Popover
                        content={
                          <>
                            Your $farther balance dropped below the{" "}
                            {TIPPER_REQUIRED_FARTHER_BALANCE.toLocaleString()}{" "}
                            balance requirement. Any tips you've given are still
                            valid, but your remaining allowance for this cycle
                            has been voided.
                          </>
                        }
                      >
                        <AlertCircle className="ml-2 w-3 text-red-400" />
                      </Popover>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-muted">Remaining</span>
                    <span>
                      {user.currentAllowance.remaining.toLocaleString()}{" "}
                      {user.currentAllowance.remaining > 0 && "✨"}
                    </span>
                  </>
                )}
              </div>
              <div className="mt-6 grid grid-cols-[100px_200px] gap-2 md:mt-0">
                <span className="text-muted font-bold md:text-lg">
                  Received
                </span>
                <span className="font-bold md:text-lg">
                  {user.latestTipsReceived.amount.toLocaleString()}{" "}
                  {user.latestTipsReceived.amount > 0 && "✨"}{" "}
                  {user.latestTipsReceived.number ? (
                    <span className="text-ghost">
                      ({user.latestTipsReceived.number} tips)
                    </span>
                  ) : null}
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
                  {user.totalTipsGiven.amount.toLocaleString()}{" "}
                  {user.totalTipsGiven.amount > 0 && "✨"}{" "}
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
                  {user.totalTipsReceived.amount.toLocaleString()}{" "}
                  {user.totalTipsReceived.amount > 0 && "✨"}{" "}
                  {user.totalTipsReceived.number ? (
                    <span className="text-ghost">
                      ({user.totalTipsReceived.number} tips)
                    </span>
                  ) : null}
                </span>
              </div>
            </div>
          </InfoCard>
        </>
      ) : !accountAddress ? (
        <InfoCard className="text-center" variant="ghost">
          <Button
            sentryId={clickIds.tipsUserInfoConnectWallet}
            variant="link"
            onClick={openConnectModal}
          >
            Connect your wallet
          </Button>
          &nbsp; to see your stats.
        </InfoCard>
      ) : (
        <NoUserFoundCard />
      )}
    </div>
  );
}
