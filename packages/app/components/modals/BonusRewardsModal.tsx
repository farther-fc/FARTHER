import { LIQUIDITY_BONUS_MULTIPLIER } from "@farther/common";

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
        claimed liquidity rewards during the current airdrop month.
      </p>
      <p>
        The snapshot takes place during the last week of each month. Exact
        timing is not guaranteed, and the bonus may be adjusted in future
        months.
      </p>
    </div>
  );
};
