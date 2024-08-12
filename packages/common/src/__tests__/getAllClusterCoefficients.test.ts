import { getAllClusterCoefficients } from "../clusteringDetection/getClusterData";
import { TipRelation } from "../clusteringDetection/graphUtils";

describe("getAllClusterCoefficients", () => {
  it("should return an empty array if no tips are provided", () => {
    const tips: TipRelation[] = [];
    const result = getAllClusterCoefficients({ tips, minTips: 1 });

    expect(result).toEqual([]);
  });

  it("should correctly calculate clustering coefficients for a simple graph", () => {
    const tips: TipRelation[] = [
      { tipperId: 1, tippeeId: 2 },
      { tipperId: 2, tippeeId: 3 },
      { tipperId: 3, tippeeId: 1 },
      { tipperId: 1, tippeeId: 4 },
    ];

    const result = getAllClusterCoefficients({ tips, minTips: 1 });

    expect(result).toEqual([
      { userId: 1, clusterCoef: 1 / 3 },
      { userId: 2, clusterCoef: 1 },
      { userId: 3, clusterCoef: 1 },
      { userId: 4, clusterCoef: 0 },
    ]);
  });

  it("should handle nodes with no neighbors", () => {
    const tips: TipRelation[] = [
      { tipperId: 1, tippeeId: 2 },
      { tipperId: 3, tippeeId: 4 },
    ];

    const result = getAllClusterCoefficients({ tips, minTips: 1 });

    expect(result).toEqual([
      { userId: 1, clusterCoef: 0 },
      { userId: 2, clusterCoef: 0 },
      { userId: 3, clusterCoef: 0 },
      { userId: 4, clusterCoef: 0 },
    ]);
  });

  it("should return 0 for all users if there are no connections between neighbors", () => {
    const tips: TipRelation[] = [
      { tipperId: 1, tippeeId: 2 },
      { tipperId: 1, tippeeId: 3 },
      { tipperId: 1, tippeeId: 4 },
    ];

    const result = getAllClusterCoefficients({ tips, minTips: 1 });

    expect(result).toEqual([
      { userId: 1, clusterCoef: 0 },
      { userId: 2, clusterCoef: 0 },
      { userId: 3, clusterCoef: 0 },
      { userId: 4, clusterCoef: 0 },
    ]);
  });

  it("should correctly calculate clustering coefficients for a complex graph", () => {
    const tips: TipRelation[] = [
      { tipperId: 1, tippeeId: 2 },
      { tipperId: 2, tippeeId: 3 },
      { tipperId: 3, tippeeId: 1 },
      { tipperId: 3, tippeeId: 4 },
      { tipperId: 4, tippeeId: 5 },
      { tipperId: 5, tippeeId: 6 },
      { tipperId: 6, tippeeId: 3 },
      { tipperId: 6, tippeeId: 4 },
      { tipperId: 6, tippeeId: 5 },
    ];

    const result = getAllClusterCoefficients({ tips, minTips: 1 });

    expect(result).toEqual([
      { userId: 1, clusterCoef: 1 },
      { userId: 2, clusterCoef: 1 },
      { userId: 3, clusterCoef: 1 / 3 },
      { userId: 4, clusterCoef: 2 / 3 },
      { userId: 5, clusterCoef: 1 },
      { userId: 6, clusterCoef: 2 / 3 },
    ]);
  });

  it("returns 0 when minTips isn't reached", () => {
    const tips: TipRelation[] = [
      { tipperId: 1, tippeeId: 2 },
      { tipperId: 2, tippeeId: 3 },
      { tipperId: 3, tippeeId: 4 },
    ];

    const result = getAllClusterCoefficients({ tips, minTips: 2 });

    expect(result).toEqual([
      { userId: 1, clusterCoef: 0 },
      { userId: 2, clusterCoef: 0 },
      { userId: 3, clusterCoef: 0 },
      { userId: 4, clusterCoef: 0 },
    ]);
  });
});
