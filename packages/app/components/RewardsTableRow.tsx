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
import { PENDING_ALLOCATION_ID, claimNames } from "@lib/constants";
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
      id: allocation.id,
    },
    {
      enabled:
        allocation.id !== PENDING_ALLOCATION_ID &&
        !allocation.isClaimed &&
        !!allocation.airdrop,
    },
  );

  const handleClaim = async () => {
    if (!proof) {
      logError({
        error: `No proof found for ${account.address}`,
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

  console.log(allocation);

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
    : claimed || isSuccess
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
            <span className="border-input cursor-default rounded-md border p-3">
              TBD <Info className="inline w-3" />
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
        ) : (
          <Button
            disabled={
              !airdropStartTimeExceeded ||
              !allocation.airdrop?.address ||
              allocation.isClaimed ||
              isSuccess ||
              loading
            }
            loading={loading}
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
        Pending <Info className="inline w-3" />
      </span>
    </Popover>
  );
}
