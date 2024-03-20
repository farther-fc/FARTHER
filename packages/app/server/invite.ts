import { z } from "zod";
import { protectedProcedure } from "./trpc";
import { prisma } from "@lib/prisma";
import { TRPCError } from "@trpc/server";

export const addEmailToInviteList = protectedProcedure
  .input(
    z.object({
      email: z.string(),
    })
  )
  .mutation(async (opts) => {
    // TODO: move to helper
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(opts.input.email)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid email address",
      });
    }

    try {
      await prisma.invite.upsert({
        where: {
          email: opts.input.email,
        },
        update: {},
        create: {
          email: opts.input.email,
        },
      });
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: error,
      });
    }
  });
