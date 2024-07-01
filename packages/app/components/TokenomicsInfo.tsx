import { EcosystemFundModal } from "@components/modals/EcosystemFundModal";
import { Button } from "@components/ui/Button";
import { ExternalLink } from "@components/ui/ExternalLink";
import {
  TOTAL_TOKEN_SUPPLY,
  allocationRatios,
  contractAddresses,
  fundCategoryAddresses,
} from "@farther/common/src/constants";
import { ROUTES, clickIds } from "@lib/constants";
import { useModal } from "@lib/context/ModalContext";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import numeral from "numeral";

function TokenomicsInfo() {
  const { openModal } = useModal();

  return (
    <>
      <p>
        FARTHER address:{" "}
        <ExternalLink
          href={`https://basescan.org/token/${contractAddresses.FARTHER}`}
        >
          {contractAddresses.FARTHER}
        </ExternalLink>
      </p>
      <p>
        The initial supply is{" "}
        {numeral(TOTAL_TOKEN_SUPPLY / 1_000_000_000).format("0,0")} billion
        tokens, and there is no initial price. The community decides what its
        worth. Please read the <Link href="/disclaimers">disclaimers</Link>{" "}
        before buying.
      </p>
      <p>
        Allocations amount are listed below, with respective links to Gnosis
        Safes where the pools are stored.
      </p>
      <ul>
        <li>
          {allocationRatios.POWER_DROPS * 100}%{" "}
          <Link href={ROUTES.airdrop.path}>airdrops to power users</Link>
          <ExternalLink
            href={`https://basescan.org/address/${fundCategoryAddresses.powerDrops}`}
          >
            <ExternalLinkIcon className="ml-2 inline" size={16} />
          </ExternalLink>
        </li>
        <li>
          {(allocationRatios.LIQUIDITY_REWARDS +
            allocationRatios.LIQUIDITY_BACKSTOP) *
            100}
          %{" "}
          <Link href={ROUTES.liquidty.path}>
            liquidity pool & mining rewards
          </Link>
          <ExternalLink
            href={`https://basescan.org/address/${fundCategoryAddresses.liquidity}`}
          >
            <ExternalLinkIcon className="ml-2 inline" size={16} />
          </ExternalLink>
        </li>
        <li>
          {allocationRatios.ECOSYSTEM_FUND * 100}%{" "}
          <Button
            sentryId={clickIds.ecosystemFundOpenModal}
            variant="link"
            onClick={() =>
              openModal({
                headerText: "Ecosystem fund",
                body: <EcosystemFundModal />,
              })
            }
          >
            ecosystem fund
          </Button>
          <ExternalLink
            href={`https://basescan.org/address/${fundCategoryAddresses.ecosystem}`}
          >
            <ExternalLinkIcon className="ml-2 inline" size={16} />
          </ExternalLink>
        </li>
        <li>
          {allocationRatios.TIPS * 100}%{" "}
          <Link href={ROUTES.tips.path}>tip allocations</Link>
          <ExternalLink
            href={`https://basescan.org/address/${fundCategoryAddresses.tips}`}
          >
            <ExternalLinkIcon className="ml-2 inline" size={16} />
          </ExternalLink>
        </li>
        <li>
          {allocationRatios.DEV_FUND * 100}%{" "}
          <Button
            sentryId={clickIds.founderAllocationOpenModal}
            variant="link"
            onClick={() =>
              openModal({
                headerText: "Founder Allocation",
                body: (
                  <>
                    {allocationRatios.DEV_FUND * 100}% of the FARTHER supply is
                    reserved for the founding team. After launch, it will be put
                    in a vesting contract that unlocks 25% after a year and
                    continually unlocks the remaining 75% over two years.
                  </>
                ),
              })
            }
          >
            founder allocation
          </Button>
          <ExternalLink
            href={`https://basescan.org/address/${fundCategoryAddresses.devFund}`}
          >
            <ExternalLinkIcon className="ml-2 inline" size={16} />
          </ExternalLink>
        </li>
      </ul>
      <p>
        In addition to the initial supply, the{" "}
        <ExternalLink
          href={`https://basescan.org/token/${contractAddresses.FARTHER}#code`}
        >
          Farther token contract
        </ExternalLink>{" "}
        is capable of optionally minting up to 3% of the current token supply
        per year. This could potentially be used to fund future initiatives,
        however there are currently no specific plans for it. It can be
        permanently revoked if the Farther community decides.
      </p>
    </>
  );
}

export default TokenomicsInfo;
