import { LiquidityInfo } from "@components/LiquidityInfo";
import { Button } from "@components/ui/Button";
import { ExternalLink } from "@components/ui/ExternalLink";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/Table";
import { useLiquidityPositions } from "hooks/useLiquidityPositions";

export default function LiquidityPage() {
  const {
    positions,
    loadingPositions,
    handleStakeLpToken,
    stakePending,
    stakeSuccess,
  } = useLiquidityPositions();
  const positionsArray = Object.entries(positions ?? {});

  return (
    <main className="container mt-16">
      <LiquidityInfo />
      <div className="mt-20">
        {!positionsArray.length && !loadingPositions ? (
          <>No positions found</>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position ID</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right">Rewards</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positionsArray.map(([tokenId, position]) => (
                <TableRow key={tokenId}>
                  <TableCell className="font-bold">
                    <ExternalLink
                      href={`https://app.uniswap.org/pools/${tokenId}`}
                    >
                      {tokenId}
                    </ExternalLink>
                  </TableCell>
                  <TableCell className="text-right">TODO</TableCell>
                  <TableCell className="text-right">TODO</TableCell>
                  <TableCell className="text-right">
                    {/*
                      "TODO: move this into its own component so pending stage is isolated to each row"
                  */}
                    <Button
                      onClick={() => handleStakeLpToken(tokenId)}
                      loadingText="Staking"
                      loading={stakePending}
                      disabled={stakePending || stakeSuccess}
                    >
                      Stake
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </main>
  );
}
