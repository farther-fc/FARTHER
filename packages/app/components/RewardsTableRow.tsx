import React from "react";
import { TableCell, TableRow } from "@components/ui/Table";
import { PENDING_ALLOCATION_ID, claimNames } from "@lib/constants";
import { formatDate, formatWad, startOfNextMonth } from "@lib/utils";
import { Button } from "@components/ui/Button";
import { useLogError } from "hooks/useLogError";
import { GetUserOuput } from "@lib/types/apiTypes";
import { useUser } from "@lib/context/UserContext";
import { trpcClient } from "@lib/trpcClient";
import { AllocationType } from "@farther/backend";
import { Address } from "viem";
import {
  FartherAirdrop__factory,
  powerUserAirdropConfig,
} from "@farther/common";
import {
  useSwitchChain,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { CHAIN_ID } from "@farther/common";
import { useToast } from "hooks/useToast";
import { Tooltip } from "@components/ui/Tooltip";
import { Info } from "lucide-react";

type ElementType<T> = T extends (infer U)[] ? U : T;

export function RewardsTableRow({
  allocation,
}: {
  allocation: NonNullable<
    ElementType<NonNullable<GetUserOuput>["allocations"]> & {
      aggregate?: number;
    }
  >;
}) {
  const { account, refetchBalance } = useUser();
  const logError = useLogError();
  const { mutate: setAllocationClaimed } =
    trpcClient.setAllocationClaimed.useMutation();
  const { switchChainAsync } = useSwitchChain();
  const { data: isClaimed } = useReadContract({
    abi: FartherAirdrop__factory.abi,
    address: allocation.airdrop?.address as Address,
    functionName: "isClaimed",
    args: [BigInt(allocation.index || 0)],
    query: {
      enabled: !!allocation.airdrop?.address,
    },
  });

  const {
    writeContract,
    data: claimTxHash,
    isPending,
    error: contractError,
  } = useWriteContract();
  const { toast } = useToast();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash: claimTxHash,
  });
  const claimed = isSuccess || allocation.isClaimed;
  const loading = isPending || (!!claimTxHash && !isSuccess);

  const { data: proof } = trpcClient.getMerkleProof.useQuery(
    {
      address: account.address as Address,
      type: AllocationType.POWER_USER,
    },
    {
      enabled:
        !!account.address &&
        allocation.id !== PENDING_ALLOCATION_ID &&
        !allocation.isClaimed,
    },
  );

  const handleClaim = async () => {
    if (!proof) {
      logError({ error: "No proof found", showGenericToast: true });
      return;
    }

    // For typescript
    if (!account) {
      return;
    }

    // Sanity check
    if (!allocation.airdrop?.address || !allocation.index) {
      logError({
        error: new Error("Missing airdrop address or index"),
        showGenericToast: true,
      });
      return;
    }

    if (account.chainId !== CHAIN_ID) {
      try {
        await switchChainAsync({ chainId: CHAIN_ID });
      } catch (error) {
        logError({ error });
        return;
      }
    }

    writeContract({
      abi: FartherAirdrop__factory.abi,
      address: allocation.airdrop.address as Address,
      functionName: "claim",
      args: [
        BigInt(allocation.index),
        account.address as Address,
        BigInt(allocation.amount),
        proof as `0x${string}`[],
      ],
    });
  };

  React.useEffect(() => {
    if (!contractError) return;

    logError({ error: contractError, showGenericToast: true });
  }, [logError, contractError, toast]);

  React.useEffect(() => {
    if (!isSuccess) return;

    setAllocationClaimed({ allocationId: allocation.id });
    refetchBalance();
    toast({
      msg: "Claim complete. Enjoy your tokens!",
    });
  }, [setAllocationClaimed, isSuccess, allocation.id, toast, refetchBalance]);

  /**
   * Fallback in case something happens which prevents the db getting updated with the claim status
   */
  React.useEffect(() => {
    if (!allocation.isClaimed && isClaimed) {
      setAllocationClaimed({ allocationId: allocation.id });
    }
  }, [setAllocationClaimed, allocation, isClaimed]);

  const startTime = allocation.airdrop?.startTime;
  const startTimeNum = startTime
    ? new Date(startTime).getTime()
    : Number.POSITIVE_INFINITY;
  const claimHasStarted = Date.now() > startTimeNum;

  return (
    <TableRow>
      <TableCell className="pl-0 font-medium">
        {claimNames[allocation.type]}
      </TableCell>
      <TableCell className="pr-1 text-right ">
        {allocation.id === PENDING_ALLOCATION_ID ? (
          <Tooltip
            content={
              <div className="max-w-[300px] rounded-2xl p-4 text-left">
                Your allocation will depend on how many other users earn a power
                badge during this cycle. Check back at the end of the month!
              </div>
            }
          >
            <span className="cursor-default rounded border p-1">
              TBD <Info className="inline w-3" />
            </span>
          </Tooltip>
        ) : (
          formatWad(allocation.amount)
        )}
      </TableCell>
      <TableCell className="pl-0 text-left">
        {allocation.aggregate ? <>({allocation.aggregate} posts)</> : null}
      </TableCell>
      <TableCell className="pr-0 text-right">
        <Button
          variant="secondary"
          disabled={
            !claimHasStarted ||
            !allocation.airdrop?.address ||
            allocation.isClaimed ||
            isSuccess ||
            loading
          }
          loading={loading}
          loadingText="Claiming"
          onClick={handleClaim}
        >
          {!allocation.airdrop?.address
            ? `Available ${formatDate(startOfNextMonth())}`
            : claimed || isSuccess
              ? "Claimed"
              : claimHasStarted
                ? "Claim"
                : `Available ${formatDate(new Date(startTime as string), { weekday: "short", minute: "2-digit", hour: "2-digit", timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}`}
        </Button>
      </TableCell>
    </TableRow>
  );
}
