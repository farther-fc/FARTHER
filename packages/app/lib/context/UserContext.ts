import { createContainer } from "@lib/context/unstated";
import { trpcClient } from "@lib/trpcClient";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { useReadContract } from "wagmi";
import { FartherToken__factory, contractAddresses } from "@farther/common";

// Fetches data from backend (database & Neynar) when the user connects a wallet
export const UserContext = createContainer(function () {
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
    balance,
    refetchBalance,
  };
});

export const useUser = UserContext.useContainer;

export const UserProvider = UserContext.Provider;
