import * as Sentry from "@sentry/astro";
//  profiling
import { nodeProfilingIntegration } from "@sentry/profiling-node";
//  profiling
Sentry.init({
  dsn: "https://76fdbcbeee4fb6084d036a2c19b35134@o4508085109850112.ingest.us.sentry.io/4510105677922305",
  // Adds request headers and IP for users, for more info visit: for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/astro/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  //  profiling
  integrations: [
    // Add our Profiling integration
    nodeProfilingIntegration(),
    // send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
  //  profiling
  //  logs
  // Enable logs to be sent to Sentry
  enableLogs: true,
  //  logs
  //  performance
  // Define how likely traces are sampled. Adjust this value in production,
  // or use tracesSampler for greater control.
  tracesSampleRate: 1.0,
  //  performance
  //  profiling
  // Set sampling rate for profiling
  // This is relative to tracesSampleRate
  profilesSampleRate: 1.0,
  //  profiling
});
