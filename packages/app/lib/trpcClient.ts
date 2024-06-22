import {
  experimental_formDataLink,
  httpLink,
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
    const url = `${getBaseUrl()}/api/v1`;
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
          false: httpLink({
            url,
          }),
        }),
      ],
    };
  },
  /**
   * @link https://trpc.io/docs/v11/ssr
   **/
  ssr: false,
});
