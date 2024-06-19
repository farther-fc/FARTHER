import { PRICE_REFRESH_TIME } from "@farther/common";
import * as Sentry from "@sentry/nextjs";
import * as trpcNext from "@trpc/server/adapters/next";
import { nodeHTTPFormDataContentTypeHandler } from "@trpc/server/adapters/node-http/content-type/form-data";
import { nodeHTTPJSONContentTypeHandler } from "@trpc/server/adapters/node-http/content-type/json";
import { getAdminData } from "server/admin/getAdminData";
import { invalidateStaleAllocations } from "server/admin/invalidateStaleAllocations";
import { getMerkleProof } from "server/airdrop/getMerkleProof";
import { setAllocationClaimed } from "server/airdrop/setAllocationClaimed";
import { validateTweet } from "server/evangelize/validateTweet";
import { publicGetPrice } from "server/getPrice";
import { distributeAllowances } from "server/tips/distributeAllowances";
import { handleTip } from "server/tips/handleTip";
import { publicGetTipsMeta } from "server/tips/utils/getTipsMeta";
import { createContext, router } from "server/trpc";
import {
  getUser,
  publicGetUserByAddress,
  publicGetUserByFid,
} from "server/user";

export const appRouter = router({
  getMerkleProof,
  setAllocationClaimed,
  validateTweet,
  handleTip,
  getUser,
  admin: router({
    distributeAllowances,
    getAdminData,
    invalidateStaleAllocations,
  }),
  public: router({
    user: router({
      byAddress: publicGetUserByAddress,
      byFid: publicGetUserByFid,
    }),
    tips: router({
      meta: publicGetTipsMeta,
    }),
    token: router({
      price: publicGetPrice,
    }),
  }),
  // TODO: remove this after notifying compez.eth
  tips: router({
    meta: publicGetTipsMeta,
  }),
  token: router({
    price: publicGetPrice,
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  experimental_contentTypeHandlers: [
    nodeHTTPFormDataContentTypeHandler(),
    nodeHTTPJSONContentTypeHandler(),
  ],
  onError({ error, path, input, ctx, req }) {
    console.error("ERROR", {
      error,
      path,
      message: error.message || error.cause?.message,
    });
    Sentry.captureException(error, {
      captureContext: {
        tags: {
          input: JSON.stringify(input),
          path,
          method: req.method,
          url: req.url,
          headers: req.headers.toString(),
        },
      },
    });
  },
  responseMeta(opts) {
    const { ctx, paths, errors, type } = opts;
    // assuming you have all your public routes with the keyword `public` in them
    const allPublic = paths && paths.every((path) => path.includes("public"));
    // checking that no procedures errored
    const allOk = errors.length === 0;
    // checking we're doing a query request d
    const isQuery = type === "query";
    if (ctx?.res && allPublic && allOk && isQuery) {
      return {
        headers: {
          "cache-control": `s-maxage=${PRICE_REFRESH_TIME}, stale-while-revalidate=1`,
        },
      };
    }
    return {};
  },
});
