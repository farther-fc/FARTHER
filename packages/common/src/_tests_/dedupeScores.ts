import { dedupeScores } from "src/getOpenRankScore";

describe("dedupeScores", () => {
  it("should remove duplicate scores", () => {
    const scores = [
      {
        fid: 1,
        fname: "Alice",
        username: "alice",
        rank: 1,
        score: 100,
        percentile: 99,
      },
      {
        fid: 2,
        fname: "Bob",
        username: "bob",
        rank: 2,
        score: 90,
        percentile: 90,
      },
      {
        fid: 1,
        fname: "Alice",
        username: "alice",
        rank: 1,
        score: 100,
        percentile: 99,
      },
    ];

    const dedupedScores = dedupeScores(scores);

    expect(dedupedScores).toEqual([
      {
        fid: 1,
        fname: "Alice",
        username: "alice",
        rank: 1,
        score: 100,
        percentile: 99,
      },
      {
        fid: 2,
        fname: "Bob",
        username: "bob",
        rank: 2,
        score: 90,
        percentile: 90,
      },
    ]);
  });
});
