import { Avatar } from "@components/ui/Avatar";
import { Button } from "@components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@components/ui/DropdownMenu";
import Spinner from "@components/ui/Spinner";
import { clickIds } from "@lib/constants";
import { useTokenInfo } from "@lib/context/TokenContext";
import { useUser } from "@lib/context/UserContext";
import { formatWad, shortenHash } from "@lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useDisconnect } from "wagmi";

export function ProfileMenu() {
  const { fartherUsdPrice, priceLoading } = useTokenInfo();
  const { disconnect } = useDisconnect();
  const { user, account, balance, userIsLoading } = useUser();

  function closeMenu() {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  }

  const handleDisconnect = () => {
    closeMenu();
    // Delayed disconnect, see: https://github.com/wevm/wagmi/issues/69#issuecomment-1858845261
    setTimeout(() => {
      disconnect();
    }, 100);
  };

  const profileHandle = user?.displayName || shortenHash(account.address);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="max-w-[200px]"
          sentryId={clickIds.openProfileMenu}
          variant="secondary"
        >
          {userIsLoading ? (
            <div className="mr-2">
              <Spinner size="xs" />
            </div>
          ) : (
            user?.pfpUrl && (
              <Avatar className="mr-2">
                <AvatarImage src={user.pfpUrl} />
              </Avatar>
            )
          )}
          <span className="truncate">{profileHandle}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex min-w-[150px] flex-col" align="end">
        <div className="flex flex-col p-2 text-center">
          <span className="mb-2 mt-0 text-xs">FARTHER price:</span>
          <span className="text-sm">
            $
            {priceLoading ? <Spinner size="xs" /> : fartherUsdPrice?.toFixed(5)}{" "}
          </span>
        </div>
        <div className="flex flex-col p-2 text-center">
          <span className="mb-2 mt-0 text-xs">Your balance:</span>
          <span className="text-sm">{formatWad(balance || BigInt(0))} </span>
        </div>
        <hr className="my-1" />
        <Button
          sentryId={clickIds.disconnectWallet}
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
