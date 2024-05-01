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
    handleWithdraw,
    txPending,
    stakeSuccess,
    unstakeSuccess,
    withdrawSuccess,
  } = useLiquidityHandlers();

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
          id={clickIds.liqTableRowStakeUnstake}
          className="w-36"
          onClick={() =>
            position.isStaked
              ? handleUnstake(position.id)
              : position.isHeldByStaker
                ? handleWithdraw(position.id)
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
          {withdrawSuccess
            ? "Stake"
            : position.isStaked || stakeSuccess
              ? "Unstake"
              : position.isHeldByStaker || unstakeSuccess
                ? "Withdraw"
                : "Stake"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
