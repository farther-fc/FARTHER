import { getStartOfMonthUTC } from "@farther/common";

export function getTipperScore({
  createdAt,
  score,
}: {
  createdAt: Date;
  score: number;
}) {
  const startOfMonth = getStartOfMonthUTC(0);

  return !createdAt || createdAt < startOfMonth ? 0 : score;
}
