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
  enabled: NEXT_PUBLIC_ENVIRONMENT !== "development",
  ignoreErrors: [],

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,
  beforeBreadcrumb(breadcrumb, hint) {
    if (breadcrumb.category?.startsWith("ui")) {
      const target = hint?.event.target;
      const customName = target.dataset.sentry;
      const customMessage = `${target.tagName.toLowerCase()}[sentry="${customName}"]`;
      breadcrumb.message = customName ? customMessage : breadcrumb.message;
    }
    return breadcrumb;
  },
});
