import { Button } from "@components/ui/Button";
import { Popover } from "@components/ui/Popover";
import { TableCell, TableRow } from "@components/ui/Table";
import { AllocationType } from "@farther/backend";
import {
  CHAIN_ID,
  FartherAirdrop__factory,
  TEMPORARY_EVANGELIST_DROP_START_TIME,
  getStartOfNextMonthUTC,
} from "@farther/common";
import { PENDING_ALLOCATION_ID, claimNames, clickIds } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { trpcClient } from "@lib/trpcClient";
import { GetUserOuput } from "@lib/types/apiTypes";
import { formatAirdropTime, formatWad } from "@lib/utils";
import { useLogError } from "hooks/useLogError";
import { useToast } from "hooks/useToast";
import { Info } from "lucide-react";
import React from "react";
import { Address } from "viem";
import {
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

type ElementType<T> = T extends (infer U)[] ? U : T;

export function RewardsTableRow({
  allocation,
}: {
  allocation: NonNullable<
    ElementType<NonNullable<GetUserOuput>["allocations"]>
  >;
}) {
  const { account, refetchBalance, user } = useUser();
  const addressMismatch =
    !!allocation.address &&
    !!account?.address &&
    allocation.address.toLowerCase() !== account.address.toLowerCase();
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
    isPending: isClaimPending,
    error: contractError,
  } = useWriteContract();
  const { toast } = useToast();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash: claimTxHash,
  });
  const { data: proof, isLoading: isProofLoading } =
    trpcClient.getMerkleProof.useQuery(
      {
        id: allocation.id,
      },
      {
        enabled:
          allocation.id !== PENDING_ALLOCATION_ID &&
          !allocation.isClaimed &&
          !!allocation.airdrop,
      },
    );
  const hasClaimed = isSuccess || allocation.isClaimed;
  const isTxPending = isClaimPending || (!!claimTxHash && !isSuccess);

  const handleClaim = async () => {
    if (!proof) {
      logError({
        error: `handleClaim clicked without proof! allocation ID: ${allocation.id}`,
        showGenericToast: true,
      });
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
    if (
      allocation.airdrop?.address &&
      !allocation.isClaimed &&
      !proof &&
      !isProofLoading
    ) {
      logError({
        error: new Error(`No proof found for allocation id: ${allocation.id}`),
      });
    }
  }, [logError, proof, isProofLoading, allocation]);

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
  const airdropStartTimeExceeded = Date.now() > startTimeNum;

  const buttonText = !allocation.airdrop?.address
    ? `Available ${formatAirdropTime(allocation.type === "EVANGELIST" ? TEMPORARY_EVANGELIST_DROP_START_TIME : getStartOfNextMonthUTC())}`
    : hasClaimed
      ? "Claimed"
      : airdropStartTimeExceeded
        ? "Claim"
        : `Available ${formatAirdropTime(new Date(startTime as string))}`;

  return (
    <TableRow>
      <TableCell className="pl-0 font-medium">
        {claimNames[allocation.type]}
      </TableCell>
      <TableCell className="pr-1 text-right ">
        {allocation.id === PENDING_ALLOCATION_ID ? (
          <Popover
            content={
              <div className="max-w-[300px] rounded-2xl p-4 text-left">
                Your allocation will depend on how many other users earn a power
                badge during this cycle. Check back at the end of the month!
              </div>
            }
          >
            <span className="text-muted border-muted inline-flex cursor-default items-center rounded-md border px-3 py-2">
              TBD <Info className="inline w-4 pl-1" />
            </span>
          </Popover>
        ) : (
          <Popover
            content={
              <div className="max-w-[300px] rounded-2xl p-4 text-left">
                Your base allocation is {formatWad(allocation.baseAmount)}, and
                you received a follower count bonus of{" "}
                {formatWad(
                  (
                    BigInt(allocation.amount) - BigInt(allocation.baseAmount)
                  ).toString(),
                )}
                .
              </div>
            }
          >
            <span className="cursor-default rounded-md p-3">
              <>
                {formatWad(allocation.amount)}{" "}
                {allocation.tweets?.length ? (
                  <>
                    ({allocation.tweets.length} tweet
                    {allocation.tweets.length > 1 ? "s" : ""})
                  </>
                ) : null}
              </>{" "}
              <Info className="inline w-3" />
            </span>
          </Popover>
        )}
      </TableCell>
      <TableCell className="pr-0 text-right">
        {allocation.type === AllocationType.EVANGELIST && !user?.powerBadge ? (
          <Pending />
        ) : addressMismatch ? (
          <Popover
            content={
              <div className="max-w-[300px] rounded-2xl p-4 text-left">
                Your connected address does not match the address your rewards
                are airdropped to. Please connect to {allocation.address}{" "}
                instead.
              </div>
            }
          >
            <div>
              <Button
                sentryId={clickIds.rewardsTableRowStakeUnstake}
                disabled={true}
              >
                Wrong Account <Info className="inline w-4 pl-1" />
              </Button>
            </div>
          </Popover>
        ) : (
          <Button
            sentryId={clickIds.rewardsTableRowStakeUnstake}
            disabled={
              !proof ||
              !airdropStartTimeExceeded ||
              !allocation.airdrop?.address ||
              hasClaimed ||
              isProofLoading
            }
            loading={isTxPending}
            loadingText="Claiming"
            onClick={handleClaim}
          >
            {buttonText}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}

function Pending() {
  return (
    <Popover
      content={
        <div className="max-w-[300px] rounded-2xl p-4 text-left">
          Your rewards will remain pending until you earn a Warpcast Power
          Badge. If not earned within two months from your submission, the
          rewards will expire.
        </div>
      }
    >
      <span className="border-input cursor-default rounded-md border p-3 opacity-30">
        Pending <Info className="inline w-4" />
      </span>
    </Popover>
  );
}
