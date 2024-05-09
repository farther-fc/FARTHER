import { Button } from "@components/ui/Button";
import { ExternalLink } from "@components/ui/ExternalLink";
import { Popover } from "@components/ui/Popover";
import { TableCell, TableRow } from "@components/ui/Table";
import {
  NETWORK,
  UniswapV3StakerAbi,
  contractAddresses,
  incentivePrograms,
  viemPublicClient,
} from "@farther/common";
import { POSITIONS_REFRESH_INTERVAL, clickIds } from "@lib/constants";
import { Position } from "@lib/context/LiquidityContext";
import { formatWad } from "@lib/utils";
import { useLiquidityHandlers } from "hooks/useLiquidityHandlers";
import { Info } from "lucide-react";
import React from "react";

export function LiquidityTableRow({ position }: { position: Position }) {
  const timer = React.useRef<NodeJS.Timeout>();
  const {
    handleStake,
    handleUnstake,
    stakePending,
    unstakePending,
    stakeSuccess,
    unstakeSuccess,
  } = useLiquidityHandlers();
  const [unclaimedRewards, setUnclaimedRewards] = React.useState<bigint>(
    BigInt(0),
  );

  const txPending = stakePending || unstakePending;
  const positionClosed = position.liquidity === BigInt(0);
  const disabled = positionClosed || txPending;

  const updatePositionRewards = async () => {
    try {
      const [unclaimedReward] = await viemPublicClient.readContract({
        abi: UniswapV3StakerAbi,
        address: contractAddresses.UNISWAP_V3_STAKER,
        functionName: "getRewardInfo",
        args: [
          {
            rewardToken: contractAddresses.FARTHER,
            pool: contractAddresses.UNIV3_FARTHER_ETH_30BPS_POOL,
            startTime: BigInt(incentivePrograms[1].startTime),
            endTime: BigInt(incentivePrograms[1].endTime),
            refundee: incentivePrograms[1].refundee,
          },
          // tokenId
          BigInt(position.id),
        ],
      });
      setUnclaimedRewards(unclaimedReward);
    } catch (e: any) {
      if (e.message?.includes("stake does not exist")) {
        return BigInt(0);
      } else {
        throw e;
      }
    }
  };

  React.useEffect(() => {
    if (!position.isStaked) return;
    timer.current = setInterval(() => {
      updatePositionRewards();
    }, POSITIONS_REFRESH_INTERVAL);

    return () => clearInterval(timer.current);
  });

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
        {formatWad(unclaimedRewards.toString())}
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
