import { initTRPC } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";

export const createContext = async (opts: CreateNextContextOptions) => {
  return { req: opts.req };
};

const t = initTRPC
  .context<Awaited<ReturnType<typeof createContext>>>()
  .create();

// Base router and procedure helpers
export const router = t.router;

/**
 * Unprotected procedure
 */
export const publicProcedure = t.procedure;
