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
  // const accountAddress = account?.address;
  const accountAddress = "0x5e46a8ecd4f4f0737ad7b7d243e767861885ed06"; // russian_acai
  // const accountAddress = "0x02ab6dd8bff3aa73a0c0e5de4647ebd0700e4802"; // juhn0512
  // const accountAddress = "0x0aecfbcd36b15dfb73d9ccaaeac1ebc3f8ace5a0"; // jmggang
  // const accountAddress = "0x0582f4770042113cc8a72101759e8f709c25cbe3"; // shokoon
  // const accountAddress = "0x9fa1cc9e482f3759b1e4cd2d8bd750546413166d"; // pump1991

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
