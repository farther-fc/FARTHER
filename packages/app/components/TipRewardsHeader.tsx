import { Popover } from "@components/ui/Popover";
import { TIPPER_REWARDS_POOL, dayUTC } from "@farther/common";
import { useTokenInfo } from "@lib/context/TokenContext";
import { HelpCircle } from "lucide-react";
import numeral from "numeral";

export default function TipRewardsHeader() {
  const { fartherUsdPrice } = useTokenInfo();
  return (
    <div className="flex justify-center flex-col items-center mb-8">
      <span className="text-ghost text-sm uppercase">
        {dayUTC().format("MMMM")} Rewards Pool
      </span>
      <span className="mt-2 mb-0 text-3xl">
        <Popover
          content={`The rewards pool is distributed at the end of the month, pro rata to all tippers who have a positive tipper score.`}
        >
          <div className="flex items-center justify-end">
            {numeral(TIPPER_REWARDS_POOL).format("0,0")} ✨{" "}
            <HelpCircle className="text-muted ml-2 size-4" />
          </div>
        </Popover>
      </span>
      {fartherUsdPrice && (
        <span className="text-ghost mt-2 text-xl">
          ${numeral(TIPPER_REWARDS_POOL * fartherUsdPrice).format("0,0")}
        </span>
      )}
    </div>
  );
}
