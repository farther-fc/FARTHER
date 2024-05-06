import { Button } from "@components/ui/Button";
import { ExternalLink } from "@components/ui/ExternalLink";
import { Popover } from "@components/ui/Popover";
import { TableCell, TableRow } from "@components/ui/Table";
import { NETWORK } from "@farther/common";
import { clickIds } from "@lib/constants";
import { Position } from "@lib/context/LiquidityContext";
import { formatWad } from "@lib/utils";
import { useLiquidityHandlers } from "hooks/useLiquidityHandlers";
import { Info } from "lucide-react";

export function LiquidityTableRow({ position }: { position: Position }) {
  const {
    handleStake,
    handleUnstake,
    stakePending,
    unstakePending,
    stakeSuccess,
    unstakeSuccess,
  } = useLiquidityHandlers();

  const txPending = stakePending || unstakePending;
  const positionClosed = position.liquidity === BigInt(0);
  const disabled = positionClosed || txPending;

  return (
    <TableRow key={position.id}>
      <TableCell className="pl-0 font-bold">
        <ExternalLink
          href={`https://app.uniswap.org/pools/${position.id}?chain=${NETWORK}`}
        >
          {position.id}
        </ExternalLink>
      </TableCell>
      <TableCell className="text-right">
        {formatWad(position.unclaimedRewards.toString())}
      </TableCell>
      <TableCell className="pr-0 text-right">
        {positionClosed ? (
          <Popover
            content={
              <div className="max-w-[300px] rounded-2xl p-4 text-left">
                This position currently has no liquidity.
              </div>
            }
          >
            <div>
              <Button sentryId="" className="w-36" disabled={true}>
                Closed <Info className="inline w-4 pl-1" />
              </Button>
            </div>
          </Popover>
        ) : (
          <Button
            sentryId={clickIds.liqTableRowStakeUnstake}
            className="w-36"
            onClick={() =>
              position.isStaked
                ? handleUnstake(position.id)
                : handleStake(position.id)
            }
            loadingText={
              position.isStaked
                ? "Unstaking"
                : position.isHeldByStaker
                  ? "Withdrawing"
                  : "Staking"
            }
            loading={txPending}
            disabled={disabled}
          >
            {position.isStaked || (stakeSuccess && !unstakeSuccess)
              ? "Unstake"
              : "Stake"}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
