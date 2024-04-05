import React from "react";
import { TableCell, TableRow } from "@components/ui/Table";
import { claimNames } from "@lib/constants";
import { formatWad } from "@lib/utils";
import { Button } from "@components/ui/Button";
import { useLogError } from "hooks/useLogError";
import { GetUserOuput } from "@lib/types/apiTypes";
import { useUser } from "@lib/context/UserContext";
import { trpcClient } from "@lib/trpcClient";
import { AirdropType } from "@backend/prisma";
import { Address } from "viem";
import { FartherAirdrop__factory } from "@common/typechain";
import {
  useSwitchChain,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { defaultChainId } from "@common/env";
import { useToast } from "hooks/useToast";

type ElementType<T> = T extends (infer U)[] ? U : T;

export function RewardsTableRow({
  allocation,
}: {
  allocation: NonNullable<
    ElementType<NonNullable<GetUserOuput>["allocations"]>
  >;
}) {
  const { account } = useUser();
  const logError = useLogError();
  const { mutate: setAllocationClaimed } =
    trpcClient.setAllocationClaimed.useMutation();
  const { switchChainAsync } = useSwitchChain();
  const { data: isClaimed } = useReadContract({
    abi: FartherAirdrop__factory.abi,
    address: allocation.airdrop.address as Address,
    functionName: "isClaimed",
    args: [BigInt(allocation.index)],
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
      type: AirdropType.POWER_USER,
    },
    { enabled: !!account.address },
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
    if (!allocation.airdrop.address) {
      logError({
        error: new Error("No airdrop address found"),
        showGenericToast: true,
      });
      return;
    }

    if (account.chainId !== defaultChainId) {
      try {
        await switchChainAsync({ chainId: defaultChainId });
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
  }, [logError, contractError]);

  React.useEffect(() => {
    if (!isSuccess) return;

    setAllocationClaimed({ allocationId: allocation.id });

    toast({
      msg: "Claim complete. Enjoy your tokens!",
    });
  }, [setAllocationClaimed, isSuccess, allocation.id, toast]);

  /**
   * Fallback in case something happens which prevents the db getting updated with the claim status
   */
  React.useEffect(() => {
    if (!allocation.isClaimed && isClaimed) {
      setAllocationClaimed({ allocationId: allocation.id });
    }
  }, [setAllocationClaimed, allocation, isClaimed]);

  return (
    <TableRow>
      <TableCell className="font-medium">
        {claimNames[allocation.airdrop.type]}
      </TableCell>
      <TableCell className="text-right">
        {formatWad(allocation.amount)}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="outline"
          disabled={
            !allocation.airdrop.address ||
            allocation.isClaimed ||
            isSuccess ||
            loading
          }
          loading={loading}
          loadingText="Claiming"
          onClick={handleClaim}
        >
          {!allocation.airdrop.address
            ? "Available Soon"
            : claimed || isSuccess
              ? "Claimed"
              : "Claim"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
