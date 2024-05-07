import { FartherToken__factory, contractAddresses } from "@farther/common";
import { createContainer } from "@lib/context/unstated";
import { trpcClient } from "@lib/trpcClient";
import { useToast } from "hooks/useToast";
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

  return {
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
