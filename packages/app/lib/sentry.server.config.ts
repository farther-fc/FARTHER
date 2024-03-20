import * as Sentry from "@sentry/nextjs"

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
const NEXT_PUBLIC_DEPLOY_ENVIRONMENT =
  process.env.NEXT_PUBLIC_DEPLOY_ENVIRONMENT

if (!SENTRY_DSN) {
  throw new Error("NEXT_PUBLIC_SENTRY_DSN is not defined")
}

if (!NEXT_PUBLIC_DEPLOY_ENVIRONMENT) {
  throw new Error("NEXT_PUBLIC_DEPLOY_ENVIRONMENT is not defined")
}

Sentry.init({
  dsn: SENTRY_DSN,
  environment: NEXT_PUBLIC_DEPLOY_ENVIRONMENT,
  // enabled: process.env.NEXT_PUBLIC_DEPLOY_ENVIRONMENT !== "development",
  enabled: true,
})
