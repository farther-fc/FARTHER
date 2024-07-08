// constrainWeights.test.ts
import { constrainWeights } from "./constrainWeights";

describe("constrainWeights", () => {
  test("should throw an error if breadth is less than or equal to 0", () => {
    expect(() => constrainWeights({ weights: [1, 2, 3], breadth: 0 })).toThrow(
      "Breadth must be greater than 0",
    );
    expect(() => constrainWeights({ weights: [1, 2, 3], breadth: -1 })).toThrow(
      "Breadth must be greater than 0",
    );
    expect(() =>
      constrainWeights({ weights: [1, 2, 3], breadth: 1.5 }),
    ).toThrow("Breadth must be less than or equal to 1");
  });

  test("should return an empty array if input weights are empty", () => {
    expect(constrainWeights({ weights: [], breadth: 2 })).toEqual([]);
  });

  test("should return the same array if breadth is 1", () => {
    const weights = [1, 2, 3, 4, 5];
    const result = constrainWeights({ weights, breadth: 1 });
    expect(result).toEqual(weights);
  });

  test("should correctly adjust the weights for breadth of 0.8", () => {
    const weights = [1, 2, 3, 4, 5];
    const result = constrainWeights({ weights, breadth: 0.8 });
    const expectedResult = [1.4, 2.2, 3, 3.8, 4.6];
    expect(result).toEqual(expectedResult);
  });

  test("should correctly adjust the weights for breadth of 0.5", () => {
    const weights = [1, 2, 3, 4, 5, 100];
    const result = constrainWeights({ weights, breadth: 0.5 });
    const expectedResult = [2.5, 3, 3.5, 4, 4.5, 52];
    expect(result).toEqual(expectedResult);
  });

  test("should correctly adjust the weights based on the breadth of 0.25", () => {
    const weights = [1, 2, 3, 4, 5, 50];
    const result = constrainWeights({ weights, breadth: 0.25 });
    const expectedResult = [3.25, 3.5, 3.75, 4, 4.25, 15.5];
    expect(result).toEqual(expectedResult);
  });
});
