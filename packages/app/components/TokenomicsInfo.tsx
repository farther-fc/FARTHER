import { InfoCard } from "@components/InfoCard";
import { EcosystemFundModal } from "@components/modals/EcosystemFundModal";
import { Button } from "@components/ui/Button";
import { ExternalLink } from "@components/ui/ExternalLink";
import {
  TOTAL_TOKEN_SUPPLY,
  allocationRatios,
  contractAddresses,
  fundCategoryAddresses,
} from "@farther/common/src/constants";
import { clickIds } from "@lib/constants";
import { useModal } from "@lib/context/ModalContext";
import { routes } from "@lib/routes";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import numeral from "numeral";

function TokenomicsInfo() {
  const { openModal } = useModal();

  return (
    <>
      <InfoCard variant="attention">
        On September 2, 2024, token holders were given control of the treasury
        via{" "}
        <ExternalLink href="https://basescan.org/address/0xfC14c74D0c22d589aD2B0829e11dCe2C82C28cFC#code">
          FartherDAO
        </ExternalLink>
        . The dev fund remains available for anyone interested in taking over
        the project. Please read the{" "}
        <ExternalLink href="https://paragraph.xyz/@farther/the-next-chapter">
          full announcement
        </ExternalLink>
        . This change deprecates the allocations below but the information will
        remain here for reference.
      </InfoCard>
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
          {numeral(allocationRatios.POWER_DROPS * 100).format("0,0.[0]")}%{" "}
          <Button
            sentryId={clickIds.founderAllocationOpenModal}
            variant="link"
            onClick={() =>
              openModal({
                headerText: "Powerdrops",
                body: (
                  <>
                    At launch, 25% of the FARTHER supply was reserved for
                    monthly airdrops to users with Warpcast's power badge.
                    However this program was discontinued in August 2024 in
                    favor of reallocating remaining tokens to the tipping
                    program.
                  </>
                ),
              })
            }
          >
            airdrops to power users
          </Button>
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
          <Link href={routes.liquidity.path}>
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
          {numeral(allocationRatios.TIPS * 100).format("0,0.[0]")}%{" "}
          <Link href={routes.tips.path}>tip allocations</Link>
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
                    in a vesting contract that begins linearly vesting on
                    November 1 2024 and continues for two years.
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
