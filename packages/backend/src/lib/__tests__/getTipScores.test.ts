import { TIP_SCORE_SCALER } from "@farther/common";
import Decimal from "decimal.js";
import { getTipScores } from "../getTipScores";

describe("getTipScores", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2023-07-15"));
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
        createdAt: new Date("2023-07-12"),
        amount: 200,
        startScore: 100,
      },
    ];

    const latestTippeeOpenRankScores = {
      2: 75,
      3: 150,
    };

    const expectedScores = [
      {
        hash: "hash1",
        changePerToken: new Decimal("5000").mul(TIP_SCORE_SCALER), // Adjust the expected value based on your calculations
      },
      {
        hash: "hash2",
        changePerToken: new Decimal("2500").mul(TIP_SCORE_SCALER), // Adjust the expected value based on your calculations
      },
    ];

    const result = await getTipScores({ tips, latestTippeeOpenRankScores });

    expectedScores.forEach((expectedScore, index) => {
      expect(result[index].hash).toBe(expectedScore.hash);
      expect(result[index].changePerToken.toString()).toBe(
        expectedScore.changePerToken.toString(),
      );
    });
  });

  it("should handle tips with null startScore", async () => {
    const tips = [
      {
        hash: "hash1",
        tipperId: 1,
        tippeeId: 2,
        createdAt: new Date("2023-07-10"),
        amount: 100,
        startScore: null,
      },
    ];

    const latestTippeeOpenRankScores = {
      2: 75,
    };

    const expectedScores = [
      {
        hash: "hash1",
        changePerToken: new Decimal("750").mul(TIP_SCORE_SCALER), // Adjust the expected value based on your calculations
      },
    ];

    const result = await getTipScores({ tips, latestTippeeOpenRankScores });

    expectedScores.forEach((expectedScore, index) => {
      expect(result[index].hash).toBe(expectedScore.hash);
      expect(result[index].changePerToken.toString()).toBe(
        expectedScore.changePerToken.toString(),
      );
    });
  });

  it("should handle an empty list of tips", async () => {
    const tips = [];
    const latestTippeeOpenRankScores = {};

    const result = await getTipScores({ tips, latestTippeeOpenRankScores });

    expect(result).toEqual([]);
  });

  it("should handle latestTippeeOpenRankScores with zero values", async () => {
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

    const latestTippeeOpenRankScores = {
      2: 0,
    };

    const expectedScores = [
      {
        hash: "hash1",
        changePerToken: new Decimal("-100").mul(TIP_SCORE_SCALER), // Adjust the expected value based on your calculations
      },
    ];

    const result = await getTipScores({ tips, latestTippeeOpenRankScores });

    expectedScores.forEach((expectedScore, index) => {
      expect(result[index].hash).toBe(expectedScore.hash);
      expect(result[index].changePerToken.toString()).toBe(
        expectedScore.changePerToken.toString(),
      );
    });
  });
});
