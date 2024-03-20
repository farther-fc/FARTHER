import { protectedProcedure, publicProcedure } from "./trpc"
import { apiSchemas } from "@lib/apiSchemas"
import { getImageUrl } from "@lib/helpers"
import { prisma } from "@lib/prisma"
import { MediaType } from "@farther/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const getAuthenticatedUser = publicProcedure
  .input(
    z.object({
      privyId: z.string(),
      email: z.string(),
    })
  )
  .query(async (opts) => {
    const privyId = opts.input.privyId

    const user = await prisma.user.findFirst({
      where: {
        privyId,
      },
    })

    if (!user) {
      if (!opts.input.email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "email is required",
        })
      }

      const user = await prisma.user.create({
        data: {
          privyId,
          email: opts.input.email,
        },
      })
      return {
        ...user,
        avatarUrl: null,
      }
    }

    const avatar = await prisma.media.findFirst({
      where: {
        mediaType: MediaType.USER_AVATAR,
        relationId: user.id,
      },
    })

    return {
      ...user,
      avatarUrl: avatar?.key ? getImageUrl(avatar.key) : null,
    }
  })

export const setProfileImage = protectedProcedure
  .input(apiSchemas.setProfileImage)
  .mutation(async (opts) => {
    const { uploadKey } = opts.input
    const user = opts.ctx.session.user

    try {
      const upsertData = {
        mediaType: MediaType.USER_AVATAR,
        relationId: user.id,
        key: uploadKey,
      }

      await prisma.media.upsert({
        where: {
          relationId_mediaType: {
            relationId: user.id,
            mediaType: MediaType.USER_AVATAR,
          },
        },
        update: upsertData,
        create: upsertData,
      })

      return {
        ...user,
        avatarUrl: getImageUrl(uploadKey),
      }
    } catch (error: any) {
      console.error(error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Something went wrong while saving image.",
      })
    }
  })
