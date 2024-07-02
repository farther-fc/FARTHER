import {
  LIQUIDITY_BONUS_MAX,
  LIQUIDITY_BONUS_MULTIPLIER,
} from "@farther/common";

export const BonusRewardsModal = () => {
  return (
    <div>
      <p>
        The primary liquidity incentive program is permissionless and onchain.
        Anyone can participate.
      </p>
      <p>
        However, in keeping with the mission of Farther to grow Farcaster and
        reward its power users, any liquidity provider who <em>also</em> has a
        Warpcast power badge by the time of the next airdrop snapshot will
        receive a <strong>{LIQUIDITY_BONUS_MULTIPLIER}x bonus</strong> to their
        claimed & pending liquidity rewards during the current airdrop month.
        Each liquidity provider can earn a maximum of{" "}
        {(LIQUIDITY_BONUS_MAX / 1_000_000).toLocaleString("en", {
          maximumFractionDigits: 1,
        })}{" "}
        million tokens as bonus rewards during the current incentive program.
      </p>
      <p>
        The snapshot takes place during the last week of each month. Exact
        timing is not guaranteed.
      </p>
    </div>
  );
};
