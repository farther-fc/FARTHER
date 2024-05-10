/**
 * This distributes a given amount of tokens over a period of time, with the distribution amount
 * linearly decreasing until the end date.
 *
 * @param totalAmount - The total amount of tokens to distribute over the entire period.
 * @param totalDays - The total number of days for distribution.
 * @param currentDay - The current day (1-indexed) for which to calculate the distribution amount.
 * @returns The number of tokens to distribute for the given day.
 */
function getDistributionAmount(
  totalAmount: number,
  totalDays: number,
  currentDay: number,
): number {
  if (
    totalDays <= 0 ||
    currentDay < 1 ||
    currentDay > totalDays ||
    totalAmount <= 0
  ) {
    throw new Error("Invalid input parameters");
  }

  // Sum of the arithmetic series: (totalDays * (totalDays + 1)) / 2
  const totalWeights = (totalDays * (totalDays + 1)) / 2;

  // The weight for the current day (decreasing linear scale)
  const dayWeight = totalDays - currentDay + 1;

  // Calculate the distribution amount based on the proportion of this day's weight to the total
  return (dayWeight / totalWeights) * totalAmount;
}

// Tests
function testDistributionFunction() {
  try {
    // Test 1
    let result = getDistributionAmount(1000, 5, 1);
    console.info(`Test 1: Day 1 - Expected: 333.33, Got: ${result.toFixed(2)}`);

    // Test 2
    result = getDistributionAmount(1000, 5, 3);
    console.info(`Test 2: Day 3 - Expected: 166.67, Got: ${result.toFixed(2)}`);

    // Test 3
    result = getDistributionAmount(1000, 5, 5);
    console.info(`Test 3: Day 5 - Expected: 66.67, Got: ${result.toFixed(2)}`);

    // Test 4 - Total amount is zero
    try {
      getDistributionAmount(0, 5, 3);
    } catch (error: any) {
      console.info(`Test 4: Error as expected - ${error.message}`);
    }

    // Test 5 - Negative current day
    try {
      getDistributionAmount(1000, 5, -1);
    } catch (error: any) {
      console.info(`Test 5: Error as expected - ${error.message}`);
    }

    // Test 6 - Current day greater than total days
    try {
      getDistributionAmount(1000, 5, 6);
    } catch (error: any) {
      console.info(`Test 6: Error as expected - ${error.message}`);
    }

    console.info("All tests completed.");
  } catch (error: any) {
    console.error("An error occurred during testing:", error);
  }
}

function test2() {
  const totalAmount = 10_000_000;
  const totalDays = 365;
  let totalDistributed = 0;

  for (let i = 1; i <= totalDays; i++) {
    const amount = getDistributionAmount(totalAmount, totalDays, i);

    totalDistributed += amount;
  }
  console.info({ totalDistributed });
}

testDistributionFunction();
test2();
