import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const NEXT_PUBLIC_ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;

if (NEXT_PUBLIC_ENVIRONMENT !== "development" && !SENTRY_DSN) {
  throw new Error(
    "NEXT_PUBLIC_ENVIRONMENT must be set for non-development environments",
  );
}

Sentry.init({
  dsn: SENTRY_DSN,
  environment: NEXT_PUBLIC_ENVIRONMENT,
  enabled: NEXT_PUBLIC_ENVIRONMENT !== "development",
});
