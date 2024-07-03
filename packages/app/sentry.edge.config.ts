import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const NEXT_PUBLIC_ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;

if (NEXT_PUBLIC_ENVIRONMENT !== "development" && !NEXT_PUBLIC_ENVIRONMENT) {
  throw new Error(
    "NEXT_PUBLIC_ENVIRONMENT must be set for non-development environments",
  );
}

if (!SENTRY_DSN) {
  throw new Error("NEXT_PUBLIC_SENTRY_DSN is not defined");
}

Sentry.init({
  dsn: SENTRY_DSN,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.1,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
