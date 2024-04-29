// This roughly determines the bonus accounts with many followers will receive
export function allocateTokens(
  users: { fid: number; followers: number }[],
  totalSupply: number,
): { fid: number; followers: number; allocation: number }[] {
  // relative to accounts with few followers.
  const FOLLOWER_COUNT_SCALER = 10;

  if (users.length === 0) {
    return [];
  }

  // Find minimum and maximum followers
  const minFollowers = Math.min(...users.map((user) => user.followers));
  const maxFollowers = Math.max(...users.map((user) => user.followers));

  // Avoid division by zero in case all users have the same number of followers
  if (minFollowers === maxFollowers) {
    const equalTokens = Math.floor(totalSupply / users.length);
    return users.map((user) => ({ ...user, allocation: equalTokens }));
  }

  // Compute initial scales where scale is between 1 and 5
  const initialScales = users.map((user) => {
    const scale =
      1 +
      ((user.followers - minFollowers) / (maxFollowers - minFollowers)) *
        FOLLOWER_COUNT_SCALER;
    return scale;
  });

  // Calculate the total of the initial scales
  const totalInitialScale = initialScales.reduce(
    (sum, scale) => sum + scale,
    0,
  );

  // Normalize scales to fit the total supply of tokens
  const normalizedScales = initialScales.map(
    (scale) => (scale / totalInitialScale) * totalSupply,
  );

  // Round tokens and adjust to ensure exact total supply
  let roundedTokens = normalizedScales.map((scale) => Math.floor(scale));
  let currentTotal = roundedTokens.reduce((sum, tokens) => sum + tokens, 0);

  // Distribute remaining tokens (due to flooring) starting from the largest remainder
  while (currentTotal < totalSupply) {
    let remainders = normalizedScales.map((scale, index) => ({
      remainder: scale - roundedTokens[index],
      index,
    }));
    const maxRemainderIndex = remainders.reduce(
      (max, current) => (current.remainder > max.remainder ? current : max),
      remainders[0],
    ).index;
    roundedTokens[maxRemainderIndex]++;
    currentTotal++;
  }

  // Assign tokens back to users
  return users.map((user, index) => ({
    ...user,
    allocation: roundedTokens[index],
  }));
}
