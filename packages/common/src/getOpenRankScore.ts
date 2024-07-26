import { AxiosResponse } from "axios";
import Bottleneck from "bottleneck";
import { chunk } from "underscore";
import { axios } from "./axios";
import { OPENRANK_BATCH_LIMIT, OPENRANK_URL } from "./constants";

export type OpenRankData = {
  result: {
    fid: number;
    fname: string;
    username: string;
    rank: number;
    score: number;
    percentile: number;
  }[];
};

const OPENRANK_API_KEY = process.env.OPENRANK_API_KEY;

if (!OPENRANK_API_KEY) {
  console.warn("No OPENRANK_API_KEY set! Rate limit will be 10 req/sec.");
}
// const RATE_LIMIT = OPENRANK_API_KEY ? 100 : 10;
const RATE_LIMIT = 10;

const scheduler = new Bottleneck({
  maxConcurrent: 30,
  minTime: 1000 / RATE_LIMIT,
});

export const getOpenRankScores = async (fids: number[]) => {
  const fidChunks = chunk(fids, OPENRANK_BATCH_LIMIT);

  return await Promise.all(
    fidChunks.map((fids) =>
      scheduler.schedule(() =>
        axios.post(OPENRANK_URL, fids, {
          headers: {
            "API-Key": OPENRANK_API_KEY,
          },
        }),
      ),
    ),
  ).then(async (responses: AxiosResponse<OpenRankData>[]) => {
    const allResults = responses.map((response) => response.data.result);
    const allScores: OpenRankData["result"] = [];
    for (const result of allResults) {
      allScores.push(...result);
    }
    return dedupeScores(allScores);
  });
};

export const dedupeScores = (scores: OpenRankData["result"]) => {
  return scores.filter(
    (item, index, self) =>
      index ===
      self.findIndex((t) => t.fid === item.fid && t.score === item.score),
  );
};
