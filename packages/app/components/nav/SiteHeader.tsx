import Link from "next/link";
import { NavMenu } from "@components/nav/NavMenu";
import { useUser } from "@lib/context/UserContext";
import { Button } from "@components/ui/Button";
import { ProfileMenu } from "@components/nav/ProfileMenu";
import { ThemeToggle } from "@components/ThemeToggle";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useScrollPosition } from "hooks/useScrollPosition";

export function SiteHeader() {
  const { openConnectModal } = useConnectModal();
  const { account } = useUser();
  const scrollPos = useScrollPosition();

  return (
    <header
      className={`sticky top-0 z-40 w-full ${scrollPos > 0 ? "backdrop-blur-md" : ""}`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center whitespace-pre hover:no-underline md:text-xl"
        >
          F A R T H E R ✨
        </Link>
        <div className="flex space-x-2">
          {account.isConnected ? (
            <ProfileMenu />
          ) : (
            openConnectModal && (
              <Button className="px-2" onClick={() => openConnectModal()}>
                Connect
              </Button>
            )
          )}
          <NavMenu />
        </div>
      </div>
    </header>
  );
}
