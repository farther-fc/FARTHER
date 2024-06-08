import { TRPCError, initTRPC } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { ZodError } from "zod";

export const createContext = async (opts: CreateNextContextOptions) => {
  return opts;
};

const t = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create({
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

// Base router and procedure helpers
export const router = t.router;

/**
 * Unprotected procedure
 */
export const publicProcedure = t.procedure;

export const adminProcedure = t.procedure.use(async function (opts) {
  const { req } = opts.ctx;

  const authHeader = req.headers.authorization;

  if (authHeader !== process.env.CRON_SECRET) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid secret" });
  }

  return opts.next({
    ctx: opts.ctx,
  });
});
