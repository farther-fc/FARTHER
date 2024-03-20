import * as trpcNext from "@trpc/server/adapters/next";
import { nodeHTTPFormDataContentTypeHandler } from "@trpc/server/adapters/node-http/content-type/form-data";
import { nodeHTTPJSONContentTypeHandler } from "@trpc/server/adapters/node-http/content-type/json";
import { createContext, router } from "server/trpc";

export const appRouter = router({
  // define your API procedures here
  // see `server/trpc.ts` for more details
  // publicProcedure,
  // user: {
  //
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
  onError({ error, type, path, input, ctx, req }) {
    // TODO: set up sentry
    console.error("ERROR", {
      type,
      path,
      message: error.message || error.cause?.message,
    });
  },
});
