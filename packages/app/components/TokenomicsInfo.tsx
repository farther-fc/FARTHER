import { EcosystemFundModal } from "@components/modals/EcosystemFundModal";
import { Button } from "@components/ui/Button";
import { ExternalLink } from "@components/ui/ExternalLink";
import {
  TOTAL_TOKEN_SUPPLY,
  allocationRatios,
  contractAddresses,
} from "@farther/common/src/constants";
import { ROUTES } from "@lib/constants";
import { useModal } from "@lib/context/ModalContext";
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
      <p>It is allocated as follows:</p>
      <ul>
        <li>
          {allocationRatios.POWER_DROPS * 100}%{" "}
          <Link href={ROUTES.airdrop.path}>airdrops to power users</Link>
        </li>
        <li>
          {(allocationRatios.LIQUIDITY_REWARDS +
            allocationRatios.LIQUIDITY_BACKSTOP) *
            100}
          %{" "}
          <Link href={ROUTES.liquidty.path}>
            liquidity pool & mining rewards
          </Link>
        </li>
        <li>
          {allocationRatios.EVANGELIST_REWARDS * 100}%{" "}
          <Link href={ROUTES.evangelize.path}>evangelist rewards</Link>
        </li>
        <li>
          {allocationRatios.ECOSYSTEM_FUND * 100}%{" "}
          <Button
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
        </li>
        <li>
          {allocationRatios.TIPS * 100}%{" "}
          <Link href={ROUTES.tips.path}>tip allocations</Link>
        </li>
        <li>
          {allocationRatios.DEV_FUND * 100}%{" "}
          <Button
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
