import { Button } from "@components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@components/ui/DropdownMenu";
import { useUser } from "@lib/context/UserContext";
import { formatWad, shortenHash } from "@lib/utils";
import { Avatar } from "@components/ui/Avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useDisconnect, useReadContract } from "wagmi";
import { useMediaQuery } from "@lib/context/MediaQueryContext";
import { FartherToken__factory } from "@common/typechain";
import { contractAddresses } from "@common/constants";
import { defaultChainId } from "@common/env";
import { Address } from "viem";
import React from "react";

export function ProfileMenu() {
  const tokenAddress = contractAddresses[defaultChainId].TOKEN;
  const { isTablet } = useMediaQuery();
  const { disconnect } = useDisconnect();
  const { user, account } = useUser();
  const { data: balance } = useReadContract({
    abi: FartherToken__factory.abi,
    address: tokenAddress,
    functionName: "balanceOf",
    args: [account.address as Address],
    query: {
      enabled: !!account.address,
    },
  });

  function closeMenu() {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  }

  const handleDisconnect = () => {
    disconnect();
    closeMenu();
  };

  const profileHandle = user?.displayName || shortenHash(account.address);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {user?.pfpUrl && isTablet && (
            <Avatar className="mr-2">
              <AvatarImage src={user.pfpUrl} />
            </Avatar>
          )}
          {profileHandle}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col" align="end">
        <div className="p-2 text-center text-xs">
          <h5 className="mb-2 mt-0">Balance:</h5>
          {formatWad(balance ? balance.toString() : "0", "0a")}{" "}
          <span>$FARTHER</span>
        </div>
        <hr className="my-1" />
        <Button
          variant="ghost"
          className="w-auto p-0"
          onClick={handleDisconnect}
        >
          Disconnect
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
