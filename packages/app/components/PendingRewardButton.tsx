import { Button } from "@components/ui/Button";
import { Popover } from "@components/ui/Popover";
import { Info } from "lucide-react";

export function PendingRewardButton() {
  return (
    <Popover
      content={
        <>
          Your rewards will remain pending until you earn a Warpcast Power
          Badge. If not earned within two months from your first submission, the
          rewards will expire.
        </>
      }
    >
      <div>
        <Button
          sentryId=""
          disabled={true}
          className="w-tableButton md:w-tableButtonWide"
        >
          Pending <Info className="ml-1 w-3" />
        </Button>
      </div>
    </Popover>
  );
}
