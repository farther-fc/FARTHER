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
  const account = useAccount();
  const { toast } = useToast();
  const accountAddress = "0xacec3af796fbd7ae18a297afefb6971c2e7d500e";

  const { data: balance, refetch: refetchBalance } = useReadContract({
    abi: FartherToken__factory.abi,
    address: contractAddresses.FARTHER,
    functionName: "balanceOf",
    args: [accountAddress as Address],
    query: {
      enabled: !!accountAddress,
    },
  });

  // If undefined, the user hasn't been fetched yet.
  // If null, the user isn't on Farcaster yet.
  const {
    data: user,
    isLoading,
    refetch,
  } = trpcClient.getUser.useQuery(
    { address: accountAddress as Address },
    {
      enabled: !!accountAddress,
      gcTime: 0,
    },
  );

  const isAdmin =
    accountAddress &&
    [
      FARTHER_OWNER_ADDRESS.toLowerCase(),
      DEV_USER_ADDRESS.toLowerCase(),
      GIGAMESH_ADDRESS.toLowerCase(),
      DEV_DEPLOYER_ADDRESS.toLowerCase(),
    ].includes(accountAddress.toLowerCase());

  React.useEffect(() => {
    if (!user && !isLoading && accountAddress) {
      toast({
        variant: "error",
        msg: "A Farcaster user was not found for the connected wallet address.",
      });
    }
  }, [user, isLoading, accountAddress]);

  return {
    isAdmin,
    user,
    userLoading: isLoading,
    accountAddress,
    chainId: account.chainId,
    refetchUser: refetch,
    balance: balance || BigInt(0),
    refetchBalance,
  };
});

export const useUser = UserContext.useContainer;

export const UserProvider = UserContext.Provider;
