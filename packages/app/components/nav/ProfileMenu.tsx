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
import { useDisconnect } from "wagmi";
import { useMediaQuery } from "@lib/context/MediaQueryContext";
import { ROUTES } from "@lib/constants";
import { useRouter } from "next/router";

export function ProfileMenu() {
  const router = useRouter();
  const { isTablet } = useMediaQuery();
  const { disconnect } = useDisconnect();
  const { user, account, balance } = useUser();

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
        <div className="flex flex-col p-2 text-center">
          <span className="mb-2 mt-0 text-xs">$FARTHER balance:</span>
          <span className="text-sm">
            {formatWad(balance ? balance.toString() : "0")}{" "}
          </span>
        </div>
        <Button
          className="my-2"
          variant="outline"
          onClick={() => router.push(ROUTES.rewards.path)}
        >
          Rewards
        </Button>
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
