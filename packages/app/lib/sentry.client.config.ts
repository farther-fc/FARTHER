import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const NEXT_PUBLIC_ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;

if (!SENTRY_DSN) {
  throw new Error("NEXT_PUBLIC_SENTRY_DSN is not defined");
}

if (!NEXT_PUBLIC_ENVIRONMENT) {
  throw new Error("NEXT_PUBLIC_ENVIRONMENT is not defined");
}

Sentry.init({
  dsn: SENTRY_DSN,
  environment: NEXT_PUBLIC_ENVIRONMENT,
  enabled: process.env.NODE_ENV !== "development",
  ignoreErrors: [],
  debug: true,
});
