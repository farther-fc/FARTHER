import * as trpcNext from "@trpc/server/adapters/next";
import * as Sentry from "@sentry/nextjs";
import { nodeHTTPFormDataContentTypeHandler } from "@trpc/server/adapters/node-http/content-type/form-data";
import { nodeHTTPJSONContentTypeHandler } from "@trpc/server/adapters/node-http/content-type/json";
import { createContext, router } from "server/trpc";
import { getMerkleProof } from "server/airdrop/getMerkleProof";
import { setAllocationClaimed } from "server/airdrop/setAllocationClaimed";
import { getUser } from "server/user";
import { validateTweet } from "server/evangelize/validateTweet";

export const appRouter = router({
  getMerkleProof,
  setAllocationClaimed,
  getUser,
  validateTweet,
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
    // TODO: set up sentry
    console.error("ERROR", {
      error,
      path,
      message: error.message || error.cause?.message,
    });
    Sentry.captureException(error, {
      captureContext: {
        path,
        input,
        ctx,
        req,
      },
    });
  },
});
