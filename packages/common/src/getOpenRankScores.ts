import { AxiosResponse } from "axios";
import Bottleneck from "bottleneck";
import { chunk } from "underscore";
import { axios } from "./axios";
import {
  OPENRANK_BATCH_LIMIT,
  OPENRANK_ENGAGEMENT_URL,
  OPENRANK_FOLLOWING_URL,
} from "./constants";

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

const NEXT_PUBLIC_OPENRANK_API_KEY = process.env.NEXT_PUBLIC_OPENRANK_API_KEY;

if (!NEXT_PUBLIC_OPENRANK_API_KEY) {
  console.warn(
    "No NEXT_PUBLIC_OPENRANK_API_KEY set! Rate limit will be 10 req/sec.",
  );
}

export const getOpenRankScores = async ({
  fids,
  type,
  rateLimit = NEXT_PUBLIC_OPENRANK_API_KEY ? 50 : 10,
}: {
  fids: number[];
  type: "FOLLOWING" | "ENGAGEMENT";
  rateLimit?: number;
}) => {
  const scheduler = new Bottleneck({
    maxConcurrent: 30,
    minTime: 1000 / rateLimit,
  });

  const fidChunks = chunk(fids, OPENRANK_BATCH_LIMIT);

  const url =
    type === "FOLLOWING" ? OPENRANK_FOLLOWING_URL : OPENRANK_ENGAGEMENT_URL;

  return await Promise.all(
    fidChunks.map((fids) =>
      scheduler.schedule(() =>
        axios.post(url, fids, {
          headers: {
            "API-Key": NEXT_PUBLIC_OPENRANK_API_KEY,
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
