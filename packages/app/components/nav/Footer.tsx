import Etherscan from "@components/svgs/Etherscan";
import Farcaster from "@components/svgs/Farcaster";
import { ExternalLink } from "@components/ui/ExternalLink";
import { contractAddresses } from "@farther/common";
import { FARTHER_CHANNEL_URL } from "@lib/constants";
import Link from "next/link";

export function Footer() {
  return (
    <>
      <footer className="text-muted mt-20 border-t text-sm">
        <div className="container my-12 flex justify-between">
          <div>
            <Link href="/disclaimers">Disclaimers</Link>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <ExternalLink href={FARTHER_CHANNEL_URL}>
              <Farcaster />
            </ExternalLink>
            <ExternalLink
              href={`https://basescan.org/token/${contractAddresses.FARTHER}`}
            >
              <Etherscan />
            </ExternalLink>
          </div>
        </div>
      </footer>
    </>
  );
}
