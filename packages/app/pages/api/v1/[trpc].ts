import * as Sentry from "@sentry/nextjs";
import * as trpcNext from "@trpc/server/adapters/next";
import { nodeHTTPFormDataContentTypeHandler } from "@trpc/server/adapters/node-http/content-type/form-data";
import { nodeHTTPJSONContentTypeHandler } from "@trpc/server/adapters/node-http/content-type/json";
import { getAdminData } from "server/admin/getAdminData";
import { invalidateStaleAllocations } from "server/admin/invalidateStaleAllocations";
import { getMerkleProof } from "server/airdrop/getMerkleProof";
import { setAllocationClaimed } from "server/airdrop/setAllocationClaimed";
import { publicGetPrice } from "server/getPrice";
import { handleTip } from "server/tips/handleTip";
import {
  flushLeaderboard,
  publicTipsLeaderboard,
} from "server/tips/leaderboard";
import { publicGetTipsMeta } from "server/tips/publicGetTipsMeta";
import { publicTipsByTipper } from "server/tips/publicTipsByTipper";
import { updateEligibleTippers } from "server/tips/updateEligibleTippers";
import { createContext, router } from "server/trpc";
import {
  getUser,
  publicGetUserByAddress,
  publicGetUserByFid,
} from "server/user";

export const appRouter = router({
  getMerkleProof,
  setAllocationClaimed,
  handleTip,
  getUser,
  admin: router({
    updateEligibleTippers,
    getAdminData,
    invalidateStaleAllocations,
    flushLeaderboard,
  }),
  public: router({
    user: router({
      byAddress: publicGetUserByAddress,
      byFid: publicGetUserByFid,
    }),
    tips: router({
      meta: publicGetTipsMeta,
      leaderboard: publicTipsLeaderboard,
      byTipper: publicTipsByTipper,
    }),
    token: router({
      price: publicGetPrice,
    }),
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
});
