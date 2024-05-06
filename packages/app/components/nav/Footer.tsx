import Etherscan from "@components/svgs/Etherscan";
import Farcaster from "@components/svgs/Farcaster";
import Uniswap from "@components/svgs/Uniswap";
import { ExternalLink } from "@components/ui/ExternalLink";
import { NETWORK, contractAddresses } from "@farther/common";
import { ASSETS_URL, FARTHER_CHANNEL_URL } from "@lib/constants";
import Link from "next/link";

export function Footer() {
  return (
    <>
      <footer className="text-muted mt-20 border-t text-sm">
        <div className="container my-12 flex justify-between">
          <div className="space-x-6 md:space-x-12">
            <ExternalLink href={ASSETS_URL}>Assets</ExternalLink>
            <Link href="/disclaimers">Disclaimers</Link>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <ExternalLink href={FARTHER_CHANNEL_URL}>
              <Farcaster />
            </ExternalLink>
            <ExternalLink
              href={`https://app.uniswap.org/swap?outputCurrency=${contractAddresses.FARTHER}?chain=${NETWORK}`}
            >
              <Uniswap />
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
