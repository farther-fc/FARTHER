import { ROUTES } from "@lib/constants";
import { useMediaQuery } from "@lib/context/MediaQueryContext";
import { cn } from "@lib/utils";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Link from "next/link";
import * as React from "react";
import { useAccount, useDisconnect } from "wagmi";

const linkStyles = cn(
  "text-muted-foreground flex items-center text-sm font-medium",
);

export function MainNav() {
  const { open, close } = useWeb3Modal();
  const { isDisconnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { isTabletSm } = useMediaQuery();

  const connectButtonClick = () => {
    if (isDisconnected) {
      open();
    } else {
      close();
      disconnect();
    }
  };

  return (
    <div className="flex w-full gap-6 md:gap-10">
      <Link href="/" className="flex items-center ">
        F A R T H E R
      </Link>
      <nav className="ml-auto flex gap-6">
        {isTabletSm &&
          Object.values(ROUTES).map(({ title, path }) => (
            <Link key={path} href={path} className={linkStyles}>
              {title}
            </Link>
          ))}

        <button className="btn-primary" onClick={connectButtonClick}>
          {isDisconnected ? "Connect" : "Disconnect"}
        </button>
      </nav>
    </div>
  );
}
