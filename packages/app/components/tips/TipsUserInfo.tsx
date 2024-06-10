import { InfoCard } from "@components/InfoCard";
import { Button } from "@components/ui/Button";
import { Skeleton } from "@components/ui/Skeleton";
import { clickIds } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export function TipsUserInfo() {
  const { user, userIsLoading } = useUser();
  const { openConnectModal } = useConnectModal();

  const allowance = user?.tipAllowance?.amount || 0;
  const spent =
    user?.tipAllowance?.tips.reduce((acc, t) => t.amount + acc, 0) || 0;
  const remaining = allowance - spent;

  return (
    <>
      <h4 className="text-ghost text-sm">Your stats</h4>
      {userIsLoading ? (
        <Skeleton className="h-[140px]" />
      ) : user ? (
        <InfoCard className="mt-2">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <span className="text-muted text-lg font-bold">Allowance</span>
              <span className="text-lg font-bold">
                {user?.tipAllowance?.amount.toLocaleString() || 0} ✨
              </span>
              <span className="text-muted">Spent</span>
              <span>{spent.toLocaleString()} ✨</span>
              <span className="text-muted">Remaining</span>
              <span>{remaining.toLocaleString()} ✨</span>
            </div>
            <div className="mt-2 grid grid-cols-[100px_1fr] gap-2 md:mt-0">
              <span className="text-muted text-lg font-bold">Received</span>
              <span className="text-lg font-bold">
                {user?.tipsReceived?.toLocaleString()} ✨
              </span>
            </div>
          </div>
        </InfoCard>
      ) : (
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
      )}
    </>
  );
}
