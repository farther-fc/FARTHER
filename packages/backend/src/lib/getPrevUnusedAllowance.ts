import { getExistingTippers } from "./getExistingTippers";

export async function getPrevUnusedAllowance() {
  // Get existing tippers to calculate the total unused allowance from the previous day
  const existingTippers = await getExistingTippers();

  const prevUnusedAllowance = existingTippers.reduce(
    (allTippersTotalSpent, user) => {
      const tipperSpent = user.tipAllowances[0].tips
        .filter((t) => !t.invalidTipReason)
        .reduce((spent, tip) => tip.amount + spent, 0);

      return user.tipAllowances[0].amount - tipperSpent + allTippersTotalSpent;
    },
    0,
  );

  return prevUnusedAllowance;
}
