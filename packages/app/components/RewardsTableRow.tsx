import { ButtonWithPopover } from "@components/buttons/ButtonWithPopover";
import { Button } from "@components/ui/Button";
import { ExternalLink } from "@components/ui/ExternalLink";
import { Popover } from "@components/ui/Popover";
import { TableCell, TableRow } from "@components/ui/Table";
import { AllocationType } from "@farther/backend";
import {
  CHAIN_ID,
  FartherAirdrop__factory,
  getStartOfMonthUTC,
} from "@farther/common";
import {
  PENDING_POWER_ALLOCATION_ID,
  PENDING_TIPS_ALLOCATION_ID,
  allocationTypeLinks,
  allocationTypeNames,
  clickIds,
} from "@lib/constants";
import { useModal } from "@lib/context/ModalContext";
import { useUser } from "@lib/context/UserContext";
import { trpcClient } from "@lib/trpcClient";
import { GetUserOuput } from "@lib/types/apiTypes";
import {
  formatAirdropTime,
  formatWad,
  shortenHash,
  strikeThrough,
} from "@lib/utils";
import dayjs from "dayjs";
import { useLogError } from "hooks/useLogError";
import { useToast } from "hooks/useToast";
import { Info } from "lucide-react";
import Link from "next/link";
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
  allocTypeHasUpcomingAirdrop,
}: {
  allocation: NonNullable<
    ElementType<NonNullable<GetUserOuput>["allocations"]>
  >;
  allocTypeHasUpcomingAirdrop?: boolean;
}) {
  const { chainId, accountAddress, refetchBalance, user } = useUser();
  const addressMismatch =
    !!allocation.address &&
    !!accountAddress &&
    allocation.address.toLowerCase() !== accountAddress.toLowerCase();
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
          ![PENDING_POWER_ALLOCATION_ID, PENDING_TIPS_ALLOCATION_ID].includes(
            allocation.id,
          ) &&
          !allocation.isClaimed &&
          !!allocation.airdrop,
      },
    );
  const hasClaimed = isSuccess || allocation.isClaimed;
  const isTxPending = isClaimPending || (!!claimTxHash && !isSuccess);

  const { openModal } = useModal();

  const handleClaim = async () => {
    if (allocation.airdrop?.sablierUrl) {
      openModal({
        headerText: "Sablier Airstream",
        body: (
          <>
            <p className="mb-4">
              This airdrop is being continuously vested for one month using a{" "}
              <ExternalLink href="https://blog.sablier.com/introducing-airstreams/">
                Sablier Airstream
              </ExternalLink>
              . The purpose of this is to prevent market manipulation prior to
              claims going live, and smooth distribution over time.{" "}
              <ExternalLink href="https://warpcast.com/farther/0xa2558589">
                Explained more here
              </ExternalLink>
              .
            </p>

            <ExternalLink href={allocation.airdrop.sablierUrl}>
              <Button>Vist Claim Page</Button>
            </ExternalLink>
          </>
        ),
      });
      return;
    }

    if (!proof) {
      logError({
        error: `handleClaim clicked without proof! allocation ID: ${allocation.id}`,
        showGenericToast: true,
      });
      return;
    }

    // For typescript
    if (!accountAddress) {
      return;
    }

    // Sanity check
    if (!allocation.airdrop?.address || typeof allocation.index !== "number") {
      logError({
        error: new Error("Missing airdrop address or index"),
        showGenericToast: true,
      });
      return;
    }

    if (chainId !== CHAIN_ID) {
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
        accountAddress as Address,
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

  const startTimeNum = allocation.airdrop?.startTime
    ? new Date(allocation.airdrop.startTime).getTime()
    : Number.POSITIVE_INFINITY;

  const airdropStartTimeExceeded = Date.now() > startTimeNum;

  const isDisabled =
    !allocation.airdrop?.sablierUrl &&
    (!proof ||
      !airdropStartTimeExceeded ||
      !allocation.airdrop?.address ||
      hasClaimed ||
      isProofLoading);

  const buttonText = !allocation.airdrop?.startTime
    ? `Avail. ${formatAirdropTime(getStartOfMonthUTC(allocTypeHasUpcomingAirdrop ? 2 : 1))}`
    : hasClaimed
      ? "Claimed"
      : airdropStartTimeExceeded
        ? "Claim"
        : `Avail. ${formatAirdropTime(new Date(allocation.airdrop.startTime as string))}`;

  const formattedAmount = formatWad(BigInt(allocation.amount));

  const amountContent = (
    <>
      {allocation.isInvalidated ? (
        <span className="text-muted">{strikeThrough(formattedAmount)}</span>
      ) : (
        formattedAmount
      )}{" "}
      {allocation.tweets?.length ? (
        <>
          ({allocation.tweets.length} tweet
          {allocation.tweets.length > 1 ? "s" : ""})
        </>
      ) : null}
    </>
  );

  return (
    <TableRow>
      <TableCell className="pl-0 font-medium">
        <Link href={allocationTypeLinks[allocation.type]}>
          {allocationTypeNames[allocation.type]}
        </Link>
      </TableCell>
      <TableCell className="text-right">
        {allocation.airdrop
          ? dayjs(allocation.airdrop?.startTime).format("MMM D")
          : allocTypeHasUpcomingAirdrop
            ? formatAirdropTime(getStartOfMonthUTC(2))
            : null}
      </TableCell>
      <TableCell className="pr-1 text-right ">
        {allocation.id === PENDING_POWER_ALLOCATION_ID ? (
          <Popover
            content={
              <>
                Your allocation will depend on how many other users earn a power
                badge during this cycle. Check back at the end of the month!
              </>
            }
          >
            <div className="text-muted border-muted inline-flex cursor-default items-center rounded-md border px-3 py-2">
              TBD <Info className="ml-1 w-4" />
            </div>
          </Popover>
        ) : BigInt(allocation.baseAmount) > BigInt(0) ? (
          <Popover
            content={
              <>
                Your base allocation is{" "}
                {formatWad(BigInt(allocation.baseAmount))} and you received a
                bonus of{" "}
                {formatWad(
                  BigInt(allocation.amount) - BigInt(allocation.baseAmount),
                )}
                .
              </>
            }
          >
            <div className="flex items-center justify-end">
              {amountContent}
              <Info className="ml-1 w-3" />
            </div>
          </Popover>
        ) : allocation.type === AllocationType.LIQUIDITY ? (
          <div>{amountContent}</div>
        ) : (
          <div>{amountContent}</div>
        )}
      </TableCell>
      <TableCell className="pr-0 text-right">
        {addressMismatch ? (
          <Popover
            content={
              <div className="max-w-[300px] rounded-2xl p-4 text-left">
                Your connected address does not match the address your rewards
                are airdropped to. Please connect to{" "}
                {shortenHash(allocation.address as Address, 5, 5)} instead.
              </div>
            }
          >
            <div className="flex items-center justify-end">
              <Button
                sentryId={clickIds.rewardsTableRowStakeUnstake}
                disabled={true}
                className="w-tableButton md:w-tableButtonWide"
              >
                Wrong Account <Info className="ml-1 inline w-4" />
              </Button>
            </div>
          </Popover>
        ) : allocation.type === AllocationType.EVANGELIST &&
          allocation.isInvalidated ? (
          <ButtonWithPopover
            text="Expired"
            content="You didn't earn a power badge within three months after your first evangelist tweet. Note: The original requirement was two months but was extended due to Warpcast purging some power badge holders in the first month."
            variant="danger"
          />
        ) : allocation.type === AllocationType.EVANGELIST &&
          !user?.powerBadge ? (
          <ButtonWithPopover
            text="Pending"
            content="Your rewards will remain pending until you earn a Warpcast Power
          Badge. If not earned within two months from your first submission, the
          rewards will expire."
          />
        ) : (
          <Button
            sentryId={clickIds.rewardsTableRowStakeUnstake}
            disabled={isDisabled}
            loading={isTxPending}
            loadingText="Claiming"
            onClick={handleClaim}
            className="w-tableButton md:w-tableButtonWide"
          >
            {buttonText}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
