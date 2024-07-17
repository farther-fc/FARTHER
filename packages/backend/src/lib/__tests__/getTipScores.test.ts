import Decimal from "decimal.js";
import { getTipScores } from "../getTipScores";

const END_TIME = new Date("2023-07-15");

describe("getTipScores", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(END_TIME);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should calculate correct tip scores for given tips", async () => {
    const tips = [
      {
        hash: "hash1",
        tipperId: 1,
        tippeeId: 2,
        createdAt: new Date("2023-07-10"),
        amount: 100,
        startScore: 50,
      },
      {
        hash: "hash2",
        tipperId: 2,
        tippeeId: 3,
        createdAt: new Date("2023-07-11"),
        amount: 200,
        startScore: 100,
      },
    ];

    const endScores = {
      2: 75,
      3: 114,
    };

    const expectedScores = [
      {
        hash: "hash1",
        changePerToken: new Decimal("1000"),
      },
      {
        hash: "hash2",
        changePerToken: new Decimal("175"),
      },
    ];

    const result = await getTipScores({ tips, endScores, endTime: END_TIME });

    expectedScores.forEach((expectedScore, index) => {
      expect(result[index].hash).toBe(expectedScore.hash);
      expect(result[index].changePerToken.toString()).toBe(
        expectedScore.changePerToken.toString(),
      );
    });
  });

  it("should handle an empty list of tips", async () => {
    const tips = [];
    const endScores = {};

    const result = await getTipScores({ tips, endScores });

    expect(result).toEqual([]);
  });

  it("should handle endScores with zero values", async () => {
    const tips = [
      {
        hash: "hash1",
        tipperId: 1,
        tippeeId: 2,
        createdAt: new Date("2023-07-10"),
        amount: 100,
        startScore: 50,
      },
    ];

    const endScores = {
      2: 0,
    };

    const expectedScores = [
      {
        hash: "hash1",
        changePerToken: new Decimal("-2000"),
      },
    ];

    const result = await getTipScores({ tips, endScores });

    expectedScores.forEach((expectedScore, index) => {
      expect(result[index].hash).toBe(expectedScore.hash);
      expect(result[index].changePerToken.toString()).toBe(
        expectedScore.changePerToken.toString(),
      );
    });
  });
});
