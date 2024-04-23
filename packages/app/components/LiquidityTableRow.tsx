import React from "react";
import { TableCell, TableRow } from "@components/ui/Table";
import { Button } from "@components/ui/Button";
import { ExternalLink } from "@components/ui/ExternalLink";
import { Position, useLiquidityPositions } from "hooks/useLiquidityPositions";
import { formatWad } from "@lib/utils";
import { NETWORK } from "@farther/common";

export function LiquidityTableRow({ position }: { position: Position }) {
  const { handleStake, handleUnstake, stakePending, unstakePending } =
    useLiquidityPositions();

  return (
    <TableRow key={position.id}>
      <TableCell className="pl-0 font-bold">
        <ExternalLink
          href={`https://app.uniswap.org/pools/${position.tokenId}?chain=${NETWORK}`}
        >
          {position.tokenId}
        </ExternalLink>
      </TableCell>
      <TableCell className="text-right">
        {formatWad(position.unclaimedRewards.toString())}
      </TableCell>
      <TableCell className="text-right">
        {formatWad(position.claimedRewards.toString())}
      </TableCell>
      <TableCell className="text-right">
        <Button
          onClick={() =>
            position.isStaked
              ? handleUnstake(position.tokenId)
              : handleStake(position.tokenId)
          }
          loadingText={position.isStaked ? "Unstaking" : "Staking"}
          loading={stakePending || unstakePending}
          disabled={stakePending || unstakePending}
        >
          {position.isStaked ? "Unstake" : "Stake"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
