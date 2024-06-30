import { BonusRewardsModal } from "@components/modals/BonusRewardsModal";
import { Button } from "@components/ui/Button";
import { ExternalLink } from "@components/ui/ExternalLink";
import {
  LIQUIDITY_BONUS_MAX,
  LIQUIDITY_BONUS_MULTIPLIER,
} from "@farther/common";
import { POWER_BADGE_INFO_URL, clickIds } from "@lib/constants";
import { useModal } from "@lib/context/ModalContext";

function LiquidityBonusRewardsPopover() {
  const { openModal } = useModal();
  return (
    <>
      Bonus rewards are airdropped monthly to liquidity providers who have a{" "}
      <ExternalLink href={POWER_BADGE_INFO_URL}>
        Warpcast Power Badge
      </ExternalLink>
      . They're calculated by adding up all claimed & pending onchain rewards
      during the month & multiplying by {LIQUIDITY_BONUS_MULTIPLIER}, up to a
      monthly maximum of{" "}
      {LIQUIDITY_BONUS_MAX.toLocaleString("en", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}{" "}
      FARTHER.{" "}
      <Button
        sentryId={clickIds.liquidityInfoBonusRewards}
        onClick={() =>
          openModal({
            headerText: "Liquidity Bonus",
            body: <BonusRewardsModal />,
          })
        }
        variant="link"
      >
        Learn more✨
      </Button>
    </>
  );
}

export default LiquidityBonusRewardsPopover;
