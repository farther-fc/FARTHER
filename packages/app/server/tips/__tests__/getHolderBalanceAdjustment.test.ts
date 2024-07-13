import { getHolderBalanceAdjustment } from "../utils/getHolderBalanceAdjustment";

describe("getHolderBalanceAdjustment", () => {
  it("returns the correct weight for a given balance", async () => {
    const weight1 = getHolderBalanceAdjustment(100_000);
    const weight2 = getHolderBalanceAdjustment(500_000);
    const weight3 = getHolderBalanceAdjustment(1_000_000);

    expect(weight1).toBe(1);
    expect(weight2).toBe(1.2096910013008055);
    expect(weight3).toBe(1.3);
  });
});
