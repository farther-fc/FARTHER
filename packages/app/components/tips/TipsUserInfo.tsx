import { InfoCard } from "@components/InfoCard";
import { Button } from "@components/ui/Button";
import { DataBox } from "@components/ui/DataBox";
import { LabelValue } from "@components/ui/LabelValue";
import Spinner from "@components/ui/Spinner";
import { clickIds } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export function TipsUserInfo() {
  const { user, userIsLoading } = useUser();
  const { openConnectModal } = useConnectModal();

  return userIsLoading ? (
    <div className="flex justify-center">
      <Spinner />
    </div>
  ) : user ? (
    <DataBox>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <LabelValue
          label="Your allowance"
          value={user?.allowance.toLocaleString()}
        />
        <LabelValue
          label="Tips received"
          value={`${user?.tipsReceived?.toLocaleString()} FARTHER`}
        />
      </div>
    </DataBox>
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
  );
}
