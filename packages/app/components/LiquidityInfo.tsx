import { Button } from "@components/ui/Button";
import { ExternalLink } from "@components/ui/ExternalLink";
import { allocationRatios, contractAddresses } from "@farther/common";
import { clickIds } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export function LiquidityInfo() {
  const { account } = useUser();
  const { openConnectModal } = useConnectModal();

  return (
    <div className="content">
      <h1>Liquidity Rewards</h1>
      <p>
        {allocationRatios.LIQUIDITY_REWARDS * 100}% of the total token supply is
        allocated to liquidity rewards. The first rewards program is for the
        Uniswap V3 ETH-FARTHER (0.03%) pool on Base after the first airdrop. It
        will last for six months. Additional rewards programs will follow.
      </p>
      <h2>How to participate</h2>
      <ol>
        <li>
          <p>
            <strong>Please read before you begin:</strong>
          </p>
          <ul>
            <li>
              If this is your first time providing liquidity in a decentralized
              exchange, please consider the risks of{" "}
              <ExternalLink href="https://support.uniswap.org/hc/en-us/articles/20904453751693-What-is-Impermanent-Loss">
                impermanent loss
              </ExternalLink>
              .
            </li>
            <li>
              This rewards program is using the official{" "}
              <ExternalLink href="https://github.com/Uniswap/v3-staker">
                Uniswap V3 Staker contract
              </ExternalLink>
              . There is no public audit available, however it was developed by
              Uniswap. Use at your own risk.
            </li>

            <li>
              You only accrue Farther rewards while the price is within the
              range of liquidity of your position.
            </li>
          </ul>
        </li>
        {!account.address && (
          <li>
            <Button
              id={clickIds.liqInfoConnect}
              variant="link"
              onClick={openConnectModal}
            >
              Connect your wallet
            </Button>
          </li>
        )}
        <li>
          Add a liquidity position to the{" "}
          <ExternalLink
            href={`https://app.uniswap.org/add/ETH/${contractAddresses.FARTHER}/3000`}
          >
            pool on Uniswap
          </ExternalLink>
          .
        </li>
        <li>
          Return to this page. After a moment, refresh the page and your
          position should be displayed.
        </li>
        <li>
          Click <em>Stake</em> to initiate a transaction that locks your LP
          token. At this point, you will start accruing rewards.
        </li>
        <li>
          Claiming your rewards is a two-step process. You will first click{" "}
          <em>Unstake</em>, followed by <em>Withdraw</em>.
        </li>
      </ol>
    </div>
  );
}
