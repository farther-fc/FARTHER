import { InfoCard } from "@components/InfoCard";
import { NoUserFoundCard } from "@components/NoUserFoundCard";
import { TipperScore } from "@components/tips/TipperScore";
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
import numeral from "numeral";

const formatNum = (num: number) =>
  numeral(num).format(num >= 10000 ? "0,0.[0]a" : "0,0.[0]");

export function TipsUserInfo() {
  const { createdAt } = useTipsMeta();
  const { accountAddress, user, userLoading } = useUser();
  const { openConnectModal } = useConnectModal();

  return (
    <div className="mb-14 mt-10">
      <TipperScore />
      {userLoading ? (
        <>
          <Skeleton className="mt-8 h-[140px]" />
          <Skeleton className="mt-8 h-[140px]" />
        </>
      ) : user ? (
        <>
          <h4 className="text-ghost mt-5 text-sm uppercase">
            {createdAt ? dayjs(new Date(createdAt)).format("MMM D") : ""}
            &nbsp;Cycle
          </h4>
          <InfoCard className="mt-0 w-full">
            <div className="flex flex-col justify-between md:flex-row md:gap-36">
              <div className="grid grid-cols-[120px_1fr] w-full gap-2">
                <div className="text-muted font-bold md:text-lg">Allowance</div>
                <div className="font-bold md:text-lg flex">
                  {formatNum(user.currentAllowance.amount)}{" "}
                  {user.currentAllowance.amount > 0 && "✨"}
                </div>
                <div className="text-muted">Given</div>
                <div className="flex space-x-2 items-center">
                  <div className="flex">
                    {formatNum(user.currentAllowance.spent)}{" "}
                    {user.currentAllowance.spent > 0 && "✨"}{" "}
                  </div>
                  <div className="text-ghost text-sm">
                    {formatNum(user.currentAllowance.tipsGiven)} tips
                  </div>
                </div>
                {user.currentAllowance.invalidatedAmount ? (
                  <>
                    {" "}
                    <span className="text-muted text-red-400">Voided</span>
                    <div className="flex text-red-400">
                      {formatNum(user.currentAllowance.invalidatedAmount)}
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
                    <div className="text-muted">Remaining</div>
                    <div>
                      {formatNum(user.currentAllowance.remaining)}{" "}
                      {user.currentAllowance.remaining > 0 && "✨"}
                    </div>
                  </>
                )}
              </div>
              <div className="mt-6 grid grid-cols-[120px_1fr] w-full gap-2 md:mt-0">
                <div className="text-muted font-bold md:text-lg">Received</div>
                <div className="font-bold md:text-lg">
                  <div className="flex space-x-2 items-center">
                    <div className="flex">
                      {numeral(user.latestTipsReceived.amount).format(
                        "0,0.[0]a",
                      )}{" "}
                      {user.latestTipsReceived.amount > 0 && "✨"}{" "}
                    </div>
                    {user.latestTipsReceived.number ? (
                      <div className="text-ghost text-sm">
                        {formatNum(user.latestTipsReceived.number)} tips
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>
          <h4 className="text-ghost mt-5 text-sm">TOTALS</h4>
          <InfoCard className="mt-0 w-full">
            <div className="flex flex-col justify-between md:flex-row md:gap-36">
              <div className="grid grid-cols-[120px_1fr] w-full gap-2">
                <div className="text-muted font-bold md:text-lg">Given</div>
                <div className="font-bold md:text-lg flex space-x-2 items-center">
                  <div className="flex">
                    {formatNum(user.totalTipsGiven.amount)}{" "}
                    {user.totalTipsGiven.amount > 0 && "✨"}{" "}
                  </div>
                  <div className="text-ghost text-sm">
                    {formatNum(user.totalTipsGiven.number)} tips
                  </div>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-[120px_1fr] w-full gap-2 md:mt-0">
                <div className="text-muted font-bold md:text-lg">Received</div>
                <div className="font-bold md:text-lg flex space-x-2 items-center">
                  <div className="flex">
                    {formatNum(user.totalTipsReceived.amount)}{" "}
                    {user.totalTipsReceived.amount > 0 && "✨"}{" "}
                  </div>
                  <div className="flex space-x-2 items-center">
                    {user.totalTipsReceived.number ? (
                      <div className="text-ghost text-sm">
                        {formatNum(user.totalTipsReceived.number)} tips
                      </div>
                    ) : null}
                  </div>
                </div>
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
