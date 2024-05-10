import * as Sentry from "@sentry/nextjs";
import * as trpcNext from "@trpc/server/adapters/next";
import { nodeHTTPFormDataContentTypeHandler } from "@trpc/server/adapters/node-http/content-type/form-data";
import { nodeHTTPJSONContentTypeHandler } from "@trpc/server/adapters/node-http/content-type/json";
import { getAdminData } from "server/admin/getAdminData";
import { invalidateStaleAllocations } from "server/admin/invalidateStaleAllocations";
import { getMerkleProof } from "server/airdrop/getMerkleProof";
import { setAllocationClaimed } from "server/airdrop/setAllocationClaimed";
import { validateTweet } from "server/evangelize/validateTweet";
import { createContext, router } from "server/trpc";
import { getUser } from "server/user";

export const appRouter = router({
  getMerkleProof,
  setAllocationClaimed,
  getUser,
  validateTweet,
  getAdminData,
  invalidateStaleAllocations,
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
