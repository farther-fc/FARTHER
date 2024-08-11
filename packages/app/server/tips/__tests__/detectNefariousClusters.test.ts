import { detectNefariousClusters } from "../detectNefariousClusters";

describe("detectNefariousClusters", () => {
  it("should return an empty array when there are no tips", () => {
    const tips: { tipperId: number; tippeeId: number }[] = [];
    const clusters = detectNefariousClusters({
      tips,
      minTips: 2,
      clusteringThreshold: 0.5,
    });
    expect(clusters).toEqual([]);
  });

  it("should return an empty array when no clusters meet the threshold", () => {
    const tips = [
      { tipperId: 1, tippeeId: 2 },
      { tipperId: 2, tippeeId: 3 },
      { tipperId: 3, tippeeId: 4 },
    ];
    const clusters = detectNefariousClusters({
      tips,
      minTips: 2,
      clusteringThreshold: 0.5,
    });
    expect(clusters).toEqual([]);
  });

  it("should detect a simple dense cluster", () => {
    const tips = [
      { tipperId: 1, tippeeId: 2 },
      { tipperId: 2, tippeeId: 1 },
      { tipperId: 1, tippeeId: 3 },
      { tipperId: 3, tippeeId: 1 },
      { tipperId: 2, tippeeId: 3 },
      { tipperId: 3, tippeeId: 2 },
    ];
    const clusters = detectNefariousClusters({
      tips,
      minTips: 1,
      clusteringThreshold: 0.5,
    });
    expect(clusters).toEqual([[1, 2, 3]]);
  });

  it("should detect multiple clusters", () => {
    const tips = [
      { tipperId: 1, tippeeId: 2 },
      { tipperId: 2, tippeeId: 1 },
      { tipperId: 1, tippeeId: 3 },
      { tipperId: 3, tippeeId: 1 },
      { tipperId: 2, tippeeId: 3 },
      { tipperId: 3, tippeeId: 2 },
      { tipperId: 4, tippeeId: 5 },
      { tipperId: 5, tippeeId: 4 },
      { tipperId: 5, tippeeId: 6 },
      { tipperId: 6, tippeeId: 5 },
      { tipperId: 4, tippeeId: 6 },
      { tipperId: 6, tippeeId: 4 },
    ];
    const clusters = detectNefariousClusters({
      tips,
      minTips: 1,
      clusteringThreshold: 0.5,
    });
    expect(clusters).toEqual(
      expect.arrayContaining([
        [1, 2, 3],
        [4, 5, 6],
      ]),
    );
  });

  it("should not detect clusters below the tip threshold", () => {
    const tips = [
      { tipperId: 1, tippeeId: 2 },
      { tipperId: 2, tippeeId: 3 },
      { tipperId: 3, tippeeId: 4 },
    ];
    const clusters = detectNefariousClusters({
      tips,
      minTips: 2,
      clusteringThreshold: 0.5,
    });
    expect(clusters).toEqual([]);
  });

  it("should detect clusters even with external connections", () => {
    const tips = [
      { tipperId: 1, tippeeId: 2 },
      { tipperId: 2, tippeeId: 1 },
      { tipperId: 1, tippeeId: 3 },
      { tipperId: 3, tippeeId: 1 },
      { tipperId: 2, tippeeId: 3 },
      { tipperId: 3, tippeeId: 2 },
      { tipperId: 1, tippeeId: 4 }, // External connection
      { tipperId: 4, tippeeId: 5 }, // External connection
    ];
    const clusters = detectNefariousClusters({
      tips,
      minTips: 1,
      clusteringThreshold: 0.5,
    });

    expect(clusters.length).toBe(1);

    expect(clusters[0]).toEqual(expect.arrayContaining([1, 2, 3]));
  });
});
