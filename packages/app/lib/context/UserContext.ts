import { createContainer } from "@lib/context/unstated";
import { trpcClient } from "@lib/trpcClient";
import React from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";

// Fetches data from backend (database & Neynar) when the user connects a wallet
export const UserContext = createContainer(function () {
  const account = useAccount();

  // If undefined, the user hasn't been fetched yet.
  // If null, the user isn't on Farcaster yet.
  const { data: user, isLoading } = trpcClient.getUser.useQuery(
    { address: account.address as Address },
    { enabled: !!account.address },
  );

  return { user, userIsLoading: isLoading, account };
});

export const useUser = UserContext.useContainer;

export const UserProvider = UserContext.Provider;
