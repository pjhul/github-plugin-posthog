import PostHog from "posthog-node";

if (!process.env.POSTHOG_API_KEY) {
  throw "No PostHog API Key found in environment.";
}

if (!process.env.POSTHOG_HOST) {
  console.warn(
    "WARN: No PostHog host found in environment, defaulting to https://app.posthog.com."
  );
}

const host = process.env.POSTHOG_HOST || "https://app.posthog.com";

export const phClient = new PostHog(process.env.POSTHOG_API_KEY, {
  host,
  flushAt: 0,
  flushInterval: 0,
});

process.on("SIGTERM", () => {
  console.log("Shutting down PostHog client");
  phClient.shutdown();
});
