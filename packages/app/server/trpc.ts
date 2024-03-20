import { NEXT_PUBLIC_PRIVY_APP_ID } from "@lib/env"
import { prisma } from "@lib/prisma"
import { PrivyClient } from "@privy-io/server-auth"
import { TRPCError, initTRPC } from "@trpc/server"
import { CreateNextContextOptions } from "@trpc/server/adapters/next"
import cookie, { CookieSerializeOptions } from "cookie"

if (!process.env.PRIVY_APP_SECRET) {
  throw new Error("PRIVY_APP_SECRET is not defined")
}

const privy = new PrivyClient(
  NEXT_PUBLIC_PRIVY_APP_ID,
  process.env.PRIVY_APP_SECRET
)

export const createContext = async (opts: CreateNextContextOptions) => {
  const token = opts.req.cookies["privy-token"]

  if (!token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Missing privy token",
    })
  }

  try {
    const verifiedClaims = await privy.verifyAuthToken(token)

    const user = await prisma.user.findUnique({
      where: { privyId: verifiedClaims.userId },
    })

    return {
      getCookie(name: string) {
        const cookieHeader = opts.req.headers.cookie
        if (!cookieHeader) return
        const cookies = cookie.parse(cookieHeader)
        return cookies[name]
      },
      setCookie({
        name,
        value,
        options,
      }: {
        name: string
        value: string
        options?: CookieSerializeOptions
      }) {
        opts.res.setHeader("Set-Cookie", cookie.serialize(name, value, options))
      },
      session: {
        user,
      },
      req: opts.req,
    }
  } catch (error: any) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: error.message || "There was an error verifying the token",
    })
  }
}

const t = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create()

// Base router and procedure helpers
export const router = t.router

/**
 * Unprotected procedure
 */
export const publicProcedure = t.procedure

/**
 * Protected procedure
 */
export const protectedProcedure = t.procedure.use(async function (opts) {
  if (!opts.ctx.session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  // Need to do this otherwise Typescript thinks user might be null. ¯\_(ツ)_/¯
  const user = opts.ctx.session.user

  return opts.next({
    ctx: { ...opts.ctx, session: { user } },
  })
})
