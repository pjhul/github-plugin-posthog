import express from "express";
import bodyParser from "body-parser";
import PostHog from "posthog-node";

if (!process.env.POSTHOG_API_KEY) {
  throw "No PostHog API Key found in environment.";
}

if (!process.env.POSTHOG_HOST) {
  console.warn(
    "No PostHog host found in environment, defaulting to https://app.posthog.com."
  );
}

const host = process.env.POSTHOG_HOST || "https://app.posthog.com";
const app = express();
const port = 3000;

const phClient = new PostHog(process.env.POSTHOG_API_KEY, {
  host,
  flushAt: 0,
  flushInterval: 0,
});

app.use(bodyParser.json());

app.post("/webhooks", (req, res) => {
  try {
    const eventName = req.header("X-GitHub-Event");
    console.log(eventName);

    if (!eventName) {
      throw "No 'X-GitHub-Event' header in request";
    }

    phClient.capture({
      distinctId: "distinct_id",
      event: eventName,
    });

    res.status(200).send({});
  } catch (error) {
    console.error(error);

    res.status(400).send({ error });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

process.on("SIGTERM", () => {
  phClient.shutdown();
});
