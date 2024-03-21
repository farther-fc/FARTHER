import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect } from "wagmi";
import Link from "next/link";
import { NavMenu } from "@components/nav/NavMenu";

export function SiteHeader() {
  const { open, close } = useWeb3Modal();
  const { isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();

  const connectButtonClick = () => {
    if (isDisconnected) {
      open();
    } else {
      close();
      disconnect();
    }
  };

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center sm:justify-between">
        <Link href="/" className="flex items-center ">
          F A R T H E R
        </Link>
        <div className="flex space-x-6">
          <button className="btn-primary" onClick={connectButtonClick}>
            {isDisconnected ? "Connect" : "Disconnect"}
          </button>
          <NavMenu />
        </div>
      </div>
    </header>
  );
}
