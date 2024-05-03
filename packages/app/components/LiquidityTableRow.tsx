import { Button } from "@components/ui/Button";
import { ExternalLink } from "@components/ui/ExternalLink";
import { TableCell, TableRow } from "@components/ui/Table";
import { NETWORK } from "@farther/common";
import { clickIds } from "@lib/constants";
import { Position } from "@lib/context/LiquidityContext";
import { formatWad } from "@lib/utils";
import { useLiquidityHandlers } from "hooks/useLiquidityHandlers";

export function LiquidityTableRow({ position }: { position: Position }) {
  const {
    handleStake,
    handleUnstake,
    stakePending,
    unstakePending,
    stakeSuccess,
  } = useLiquidityHandlers();

  const txPending = stakePending || unstakePending;

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
          disabled={txPending}
        >
          {position.isStaked || stakeSuccess ? "Unstake" : "Stake"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
