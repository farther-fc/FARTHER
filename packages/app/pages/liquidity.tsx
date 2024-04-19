import { NETWORK } from "@farther/common";
import { LiquidityInfo } from "@components/LiquidityInfo";
import { Button } from "@components/ui/Button";
import { ExternalLink } from "@components/ui/ExternalLink";
import Spinner from "@components/ui/Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/Table";
import { formatWad } from "@lib/utils";
import { useLiquidityPositions } from "hooks/useLiquidityPositions";
import { InfoContainer } from "@components/InfoContainer";

export default function LiquidityPage() {
  const {
    positions,
    positionsLoading,
    handleStake,
    handleUnstake,
    stakePending,
    unstakePending,
    handleClaim,
    claimPending,
  } = useLiquidityPositions();

  return (
    <main className="container">
      <LiquidityInfo />
      <div className="mt-20">
        {positionsLoading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : !positions?.length ? (
          <InfoContainer variant="muted" className="content text-center">
            No liquidity positions found
          </InfoContainer>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position ID</TableHead>
                <TableHead className="text-right">Claimed</TableHead>
                <TableHead className="text-right">Unclaimed</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions?.map((position) => (
                <TableRow key={position.id}>
                  <TableCell className="font-bold">
                    <ExternalLink
                      href={`https://app.uniswap.org/pools/${position.tokenId}?chain=${NETWORK}`}
                    >
                      {position.tokenId}
                    </ExternalLink>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatWad(
                      position.account.rewards
                        .reduce((acc, r) => acc + r.amount, BigInt(0))
                        .toString(),
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatWad(position.reward.toString())}
                  </TableCell>
                  <TableCell className="text-right">
                    {/*
                      "TODO: move all this into its own component so pending stage is isolated to each row"
                  */}
                    {position.isStaked && (
                      <Button
                        onClick={() => handleClaim(position.reward)}
                        loadingText="Claiming"
                        loading={claimPending}
                        disabled={claimPending}
                        className="mr-4"
                      >
                        Claim
                      </Button>
                    )}
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
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </main>
  );
}
