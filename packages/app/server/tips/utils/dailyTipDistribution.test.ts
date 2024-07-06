import { dailyTipDistribution } from "../utils/dailyTipDistribution";

const FUDGE_FACTOR_DECIMALS = 5;

describe("dailyTipDistribution", () => {
  test("Correctly calculates the number of tokens to distribute on a given day", () => {
    const totalAmount = 100_000_000;
    const totalDays = 91;

    const results = [];

    let total = 0;
    for (let currentDay = 0; currentDay < totalDays; currentDay++) {
      const dailyDistribution = dailyTipDistribution({
        totalDays,
        totalAmount,
        currentDay,
        staticRatio: 1,
      });

      results.push({ currentDay, dailyDistribution });

      total += dailyDistribution;
    }

    console.log(`First day amount: ${results[0].dailyDistribution}`);
    console.log(
      `Last day amount: ${results[results.length - 1].dailyDistribution}`,
    );

    expect(parseFloat(total.toFixed(FUDGE_FACTOR_DECIMALS))).toEqual(
      totalAmount,
    );
  });
});
