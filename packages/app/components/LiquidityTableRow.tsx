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
import React from "react";

export function LiquidityTableRow({ position }: { position: Position }) {
  const {
    handleStake,
    handleUnstake,
    stakePending,
    unstakePending,
    stakeSuccess,
    unstakeSuccess,
  } = useLiquidityHandlers();
  const [pendingStakedLiqRewards, setPendingStakedLiqRewards] =
    React.useState<bigint>(BigInt(0));
  const [pendingStakedLiqRewardsLoading, setPendingStakedLiqRewardsLoading] =
    React.useState(false);

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
      <TableCell>
        <div className="flex justify-end text-right">
          {formatWad(position.pendingStakedLiqRewards, "0,0.000")}
        </div>
      </TableCell>
      <TableCell className="pr-0 text-right">
        {positionClosed ? (
          <Popover content={<>This position currently has no liquidity.</>}>
            <div>
              <Button
                sentryId=""
                className="w-tableButton md:w-tableButtonWide"
                disabled={true}
              >
                Closed <Info className="inline w-4 pl-1" />
              </Button>
            </div>
          </Popover>
        ) : (
          <Button
            sentryId={clickIds.liqTableRowStakeUnstake}
            className="w-tableButton md:w-tableButtonWide"
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
