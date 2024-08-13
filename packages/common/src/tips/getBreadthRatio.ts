import { TIP_MINIMUM } from "../constants";

export function getBreadthRatio(
  tipsGiven: { tippeeId: number; amount: number }[],
) {
  const uniqueRecipients = new Set(tipsGiven.map((tip) => tip.tippeeId)).size;
  const totalAmount = tipsGiven.reduce((acc, tip) => acc + tip.amount, 0);

  const maxBreadthTipAmount = totalAmount / TIP_MINIMUM;
  const avgTipPerUniqueRecipient = totalAmount / uniqueRecipients;

  const breadthRatio =
    (maxBreadthTipAmount / avgTipPerUniqueRecipient +
      uniqueRecipients / tipsGiven.length) /
    2;
  return breadthRatio;
}
