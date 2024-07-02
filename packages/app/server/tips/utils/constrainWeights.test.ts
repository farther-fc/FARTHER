import { constrainWeights } from "./constrainWeights";

describe("constrainWeights", () => {
  test("should adjust weights to narrow the distance between them with a factor of 0.5", () => {
    const weights = [10, 20, 30, 40, 50];
    const factor = 0.5;
    const adjustedWeights = constrainWeights({ weights, factor });
    expect(adjustedWeights).toEqual([20, 25, 30, 35, 40]);
  });

  test("should return an empty array if input is empty", () => {
    const weights: number[] = [];
    const factor = 0.5;
    const adjustedWeights = constrainWeights({ weights, factor });
    expect(adjustedWeights).toEqual([]);
  });

  test("should handle a single weight correctly with a factor of 0.5", () => {
    const weights = [10];
    const factor = 0.5;
    const adjustedWeights = constrainWeights({ weights, factor });
    expect(adjustedWeights).toEqual([10]);
  });

  test("should handle equal weights correctly with a factor of 0.5", () => {
    const weights = [20, 20, 20, 20];
    const factor = 0.5;
    const adjustedWeights = constrainWeights({ weights, factor });
    expect(adjustedWeights).toEqual([20, 20, 20, 20]);
  });

  test("should not adjust weights with a factor of 0", () => {
    const weights = [10, 20, 30, 40, 50];
    const factor = 0;
    const adjustedWeights = constrainWeights({ weights, factor });
    expect(adjustedWeights).toEqual([10, 20, 30, 40, 50]);
  });

  test("should throw an error if factor is less than 0", () => {
    const weights = [10, 20, 30];
    const factor = -0.1;
    expect(() => constrainWeights({ weights, factor })).toThrow(
      "Factor must be between 0 and 1",
    );
  });

  test("should throw an error if factor is greater than 1", () => {
    const weights = [10, 20, 30];
    const factor = 1.1;
    expect(() => constrainWeights({ weights, factor })).toThrow(
      "Factor must be between 0 and 1",
    );
  });

  test("should adjust weights minimally with a factor of 0.1", () => {
    const weights = [10, 20, 30, 40, 50];
    const factor = 0.1;
    const adjustedWeights = constrainWeights({ weights, factor });
    expect(adjustedWeights).toEqual([12, 21, 30, 39, 48]);
  });

  test("should adjust weights maximally with a factor of 1", () => {
    const weights = [10, 20, 30, 40, 50];
    const factor = 1;
    const adjustedWeights = constrainWeights({ weights, factor });
    expect(adjustedWeights).toEqual([30, 30, 30, 30, 30]);
  });
});
