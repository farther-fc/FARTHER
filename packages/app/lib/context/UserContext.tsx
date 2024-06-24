import { ExternalLink } from "@components/ui/ExternalLink";
import {
  DEV_DEPLOYER_ADDRESS,
  DEV_USER_ADDRESS,
  FARTHER_OWNER_ADDRESS,
  FartherToken__factory,
  GIGAMESH_ADDRESS,
  contractAddresses,
} from "@farther/common";
import { createContainer } from "@lib/context/unstated";
import { trpcClient } from "@lib/trpcClient";
import { useToast } from "hooks/useToast";
import React from "react";
import { Address } from "viem";
import { useAccount, useReadContract } from "wagmi";

// Fetches data from backend (database & Neynar) when the user connects a wallet
export const UserContext = createContainer(function () {
  const { toast } = useToast();
  const account = useAccount();
  const { data: balance, refetch: refetchBalance } = useReadContract({
    abi: FartherToken__factory.abi,
    address: contractAddresses.FARTHER,
    functionName: "balanceOf",
    args: [account.address as Address],
    query: {
      enabled: !!account.address,
    },
  });

  // If undefined, the user hasn't been fetched yet.
  // If null, the user isn't on Farcaster yet.
  const {
    data: user,
    isLoading,
    refetch,
  } = trpcClient.getUser.useQuery(
    { address: account.address as Address },
    {
      enabled: !!account.address,
    },
  );

  const isAdmin =
    account.address &&
    [
      FARTHER_OWNER_ADDRESS.toLowerCase(),
      DEV_USER_ADDRESS.toLowerCase(),
      GIGAMESH_ADDRESS.toLowerCase(),
      DEV_DEPLOYER_ADDRESS.toLowerCase(),
    ].includes(account.address.toLowerCase());

  React.useEffect(() => {
    if (!user?.tipAllowance) return;

    const hasSeenUpdate = localStorage.getItem("hasSeenTipEmojiUpdate");

    if (!hasSeenUpdate) {
      toast({
        title: "Important message for tippers:",
        msg: (
          <>
            Starting on Tuesday at 12pm PST, using the ✨ emoji to tip will no
            longer work.{" "}
            <ExternalLink href="https://warpcast.com/farther/0x0de67f02">
              More info here.
            </ExternalLink>
          </>
        ),
        duration: 1000000000,
      });
      localStorage.setItem("hasSeenTipEmojiUpdate", "true");
    }
  }, [toast, user?.tipAllowance]);

  return {
    isAdmin,
    user,
    userIsLoading: isLoading,
    account,
    refetchUser: refetch,
    balance: balance || BigInt(0),
    refetchBalance,
  };
});

export const useUser = UserContext.useContainer;

export const UserProvider = UserContext.Provider;
