import { FartherLogo } from "@components/icons/FartherLogo";
import { NavMenu } from "@components/nav/NavMenu";
import { ProfileMenu } from "@components/nav/ProfileMenu";
import { Button } from "@components/ui/Button";
import { clickIds } from "@lib/constants";
import { useMediaQuery } from "@lib/context/MediaQueryContext";
import { useUser } from "@lib/context/UserContext";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useScrollPosition } from "hooks/useScrollPosition";
import Link from "next/link";

export function SiteHeader() {
  const { isTablet } = useMediaQuery();
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
          <FartherLogo className=" mr-1 w-[30px]" />
          {isTablet && <span className="tracking-widest">FARTHER</span>}
        </Link>
        <div className="flex space-x-2">
          {account.isConnected ? (
            <ProfileMenu />
          ) : (
            openConnectModal && (
              <Button
                sentryId={clickIds.connectWallet}
                className="px-4"
                onClick={() => openConnectModal()}
              >
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
