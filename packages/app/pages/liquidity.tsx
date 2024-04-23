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
import { InfoContainer } from "@components/InfoContainer";
import { useUser } from "@lib/context/UserContext";
import { LiquidityTableRow } from "@components/LiquidityTableRow";

export default function LiquidityPage() {
  const { account } = useUser();
  const { positions, positionsLoading } = useLiquidityPositions();

  return (
    <main className="content">
      <LiquidityInfo />
      {account.address && (
        <div className="mt-10">
          {!IS_INCENTIVE_PROGRAM_ACTIVE ? (
            <InfoContainer variant="muted" className="content text-center">
              The liquidity incentive program is not yet active
            </InfoContainer>
          ) : positionsLoading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : !positions?.length ? (
            <InfoContainer variant="muted" className="content text-center">
              No liquidity positions found
            </InfoContainer>
          ) : (
            <>
              <h2>Positions</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-0">Position ID</TableHead>
                    <TableHead className="text-right">Pending</TableHead>
                    <TableHead className="text-right">Claimed</TableHead>
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
