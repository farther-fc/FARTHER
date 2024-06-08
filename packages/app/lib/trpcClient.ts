import { PRICE_REFRESH_TIME } from "@farther/common";
import {
  experimental_formDataLink,
  httpBatchLink,
  loggerLink,
  splitLink,
} from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { AppRouter } from "pages/api/v1/[trpc]";

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpcClient = createTRPCNext<AppRouter>({
  config() {
    const url = `${getBaseUrl()}/api`;
    return {
      links: [
        loggerLink({
          //Prints to browser console. Change to true for debugging.
          enabled: () => false,
        }),
        splitLink({
          condition: (op) => op.input instanceof FormData,
          true: experimental_formDataLink({
            url,
          }),
          false: httpBatchLink({
            url,
          }),
        }),
      ],
    };
  },
  /**
   * @link https://trpc.io/docs/v11/ssr
   **/
  ssr: true,
  responseMeta(opts) {
    const { clientErrors } = opts;

    if (clientErrors.length) {
      // propagate http first error from API calls
      return {
        status: clientErrors[0].data?.httpStatus ?? 500,
      };
    }

    if (opts.ctx.pathname.includes("getPrice")) {
      return {
        headers: {
          "cache-control": `s-maxage=${PRICE_REFRESH_TIME}, stale-while-revalidate=${PRICE_REFRESH_TIME}`,
        },
      };
    }

    return {};
  },
});
