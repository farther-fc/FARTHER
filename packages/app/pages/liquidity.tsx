import { IS_INCENTIVE_PROGRAM_ACTIVE } from "@farther/common";
import { LiquidityInfo } from "@components/LiquidityInfo";
import Spinner from "@components/ui/Spinner";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/Table";
import { useLiquidityPositions } from "hooks/useLiquidityPositions";
import { InfoCard } from "@components/InfoCard";
import { useUser } from "@lib/context/UserContext";
import { LiquidityTableRow } from "@components/LiquidityTableRow";
import { formatWad } from "@lib/utils";

export default function LiquidityPage() {
  const { account } = useUser();
  const { positions, positionsLoading, claimedRewards } =
    useLiquidityPositions();

  return (
    <main className="content">
      <LiquidityInfo />
      {account.address && (
        <div className="mt-10">
          {!IS_INCENTIVE_PROGRAM_ACTIVE ? (
            <InfoCard variant="muted" className="content text-center">
              The liquidity incentive program is not yet active
            </InfoCard>
          ) : positionsLoading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : !positions?.length ? (
            <InfoCard variant="muted" className="content text-center">
              No liquidity positions found
            </InfoCard>
          ) : (
            <>
              <h2 className="flex items-end justify-between ">
                <div className="!leading-tight">Positions</div>{" "}
                <div className="text-link rounded-lg border px-4 py-2 !text-lg !leading-normal">
                  Claimed: {formatWad(claimedRewards.toString())}
                </div>
              </h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-0">Position ID</TableHead>
                    <TableHead className="text-right">Rewards</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions?.map((position) => (
                    <LiquidityTableRow key={position.id} position={position} />
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </div>
      )}
    </main>
  );
}
