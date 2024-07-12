import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const NEXT_PUBLIC_ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;

if (NEXT_PUBLIC_ENVIRONMENT !== "development" && !NEXT_PUBLIC_ENVIRONMENT) {
  throw new Error(
    "NEXT_PUBLIC_ENVIRONMENT must be set for non-development environments",
  );
}

Sentry.init({
  dsn: SENTRY_DSN,
  environment: NEXT_PUBLIC_ENVIRONMENT,
  enabled: NEXT_PUBLIC_ENVIRONMENT !== "development",
  ignoreErrors: [],

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,
  // https://github.com/getsentry/sentry-javascript/issues/3015#issuecomment-718594200
  beforeBreadcrumb(breadcrumb, hint) {
    if (breadcrumb.category?.startsWith("ui")) {
      const target = hint?.event.target;
      const customName = target.dataset.sentry;
      const customMessage = `${target.tagName.toLowerCase()}[sentry="${customName}"]`;
      breadcrumb.message = customName ? customMessage : breadcrumb.message;
    }
    return breadcrumb;
  },
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
