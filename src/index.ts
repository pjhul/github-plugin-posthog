import express from "express";
import bodyParser from "body-parser";
import type {
  WebhookEvent,
  WebhookEventMap,
  WebhookEventName,
} from "@octokit/webhooks-types";

import {
  handlePullRequestEvent,
  handlePullRequestReviewCommentEvent,
  handleIssuesEvent,
  handleIssueCommentEvent,
  handleStarEvent,
} from "./handlers";

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/webhooks", (req, res) => {
  try {
    const eventName = req.header("X-GitHub-Event") as WebhookEventName;
    const deliveryId = req.header("X-GitHub-Delivery") as string;
    // TODO: Implement HMAC signature verification
    const signature = req.header("X-Hub-Signature-256") as string;

    const event: WebhookEvent = req.body;

    console.log(`[${deliveryId}]: Received '${eventName}' event...`);

    switch (eventName) {
      case "pull_request":
        handlePullRequestEvent(event as WebhookEventMap["pull_request"]);
        break;
      case "pull_request_review_comment":
        handlePullRequestReviewCommentEvent(
          event as WebhookEventMap["pull_request_review_comment"]
        );
        break;
      case "issues":
        handleIssuesEvent(event as WebhookEventMap["issues"]);
        break;
      case "issue_comment":
        handleIssueCommentEvent(event as WebhookEventMap["issue_comment"]);
        break;
      case "star":
        handleStarEvent(event as WebhookEventMap["star"]);
        break;
    }

    res.status(200).send({});
  } catch (error) {
    console.error(error);
    res.status(400).send({ error });
  }
});

app.listen(port, () => {
  console.log("Listening for webhook events...");
});
