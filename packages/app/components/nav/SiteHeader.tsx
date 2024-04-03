import { useWeb3Modal } from "@web3modal/wagmi/react";
import Link from "next/link";
import { NavMenu } from "@components/nav/NavMenu";
import { useUser } from "@lib/context/UserContext";
import { Button } from "@components/ui/Button";
import { ProfileMenu } from "@components/nav/ProfileMenu";
import { ThemeToggle } from "@components/ThemeToggle";

export function SiteHeader() {
  const { open } = useWeb3Modal();
  const { account } = useUser();

  return (
    <header className="bg-background sticky top-0 z-40 w-full">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center whitespace-pre md:text-xl">
          F A R T H E R ↗
        </Link>
        <div className="flex space-x-2">
          <ThemeToggle />
          {account.isConnected ? (
            <ProfileMenu />
          ) : (
            <Button variant="ghost" className="px-2" onClick={() => open()}>
              Connect
            </Button>
          )}
          <NavMenu />
        </div>
      </div>
    </header>
  );
}
