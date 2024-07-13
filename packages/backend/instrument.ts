import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { requireEnv } from "require-env-variable";

const { NEXT_PUBLIC_ENVIRONMENT } = requireEnv("NEXT_PUBLIC_ENVIRONMENT");

Sentry.init({
  environment: NEXT_PUBLIC_ENVIRONMENT,
  dsn: "https://93c1dc8e6c8706cf1b8ed2bb911d57d4@o4506703122202624.ingest.us.sentry.io/4507572421853184",
  integrations: [nodeProfilingIntegration()],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});
