import { getEvanglistAllocationBonus } from "./getEvangelistAllocation";

describe("getEvangelistAllocation", () => {
  test("it should return the correct allocations", () => {
    const allocation = getEvanglistAllocationBonus({
      followerCount: 100,
      baseTokensPerTweet: 1000,
    });

    expect(allocation === 1000);
  });
});
