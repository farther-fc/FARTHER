import { FartherToken__factory, contractAddresses } from "@farther/common";
import { createContainer } from "@lib/context/unstated";
import { trpcClient } from "@lib/trpcClient";
import { shortenHash } from "@lib/utils";
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
    { enabled: !!account.address },
  );

  React.useEffect(() => {
    if (
      user &&
      user?.verifiedAddress.toLowerCase() !== account.address?.toLowerCase()
    ) {
      toast({
        title: "Wrong address",
        msg: `The wallet address you are connected to does not match the address your Farther rewards are airdropped to. Please connect to ${shortenHash(user.verifiedAddress as `0x${string} `)} instead (this is the first address in your verified address list on Warpcast)`,
        variant: "error",
        duration: 60_000,
      });
    }
  }, [user, toast, account.address]);

  return {
    user,
    userIsLoading: isLoading,
    account,
    refetchUser: refetch,
    balance,
    refetchBalance,
  };
});

export const useUser = UserContext.useContainer;

export const UserProvider = UserContext.Provider;
