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
  beforeSend(event, _hint) {
    if (
      event.request &&
      event.request.url &&
      event.request.url.includes("/api/")
    ) {
      console.warn(
        "Ignoring event from /api route",
        event.type,
        event.request.url,
      );
      return null; // Drop the event
    }
    return event;
  },
});
