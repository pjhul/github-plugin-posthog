import type { WebhookEventMap } from "@octokit/webhooks-types";

import { flattenKeys } from "./utils";
import { phClient } from "./client";

// TODO: We should be able to unify all of these and simply check for properties
// such as 'repository' and 'issue' and if they're present, include them in the
// event

export const handlePullRequestEvent = (
  event: WebhookEventMap["pull_request"]
) => {
  phClient.capture({
    distinctId: event.sender.id.toString(),
    event: "github.pull_request." + event.action,
    properties: {
      num: event.number,
      ...flattenKeys({
        pull_request: event.pull_request,
        repository: event.repository,
      }),
      $set: {
        ...flattenKeys(event.sender),
      },
    },
  });
};

export const handlePullRequestReviewCommentEvent = (
  event: WebhookEventMap["pull_request_review_comment"]
) => {
  phClient.capture({
    distinctId: event.sender.id.toString(),
    event: "github.pull_request_review_comment." + event.action,
    properties: {
      ...flattenKeys({
        comment: event.comment,
        pull_request: event.pull_request,
        repository: event.repository,
      }),
      $set: {
        ...flattenKeys(event.sender),
      },
    },
  });
};

export const handleIssuesEvent = (event: WebhookEventMap["issues"]) => {
  phClient.capture({
    distinctId: event.sender.id.toString(),
    event: "github.issues." + event.action,
    properties: {
      ...flattenKeys({
        issue: event.issue,
        repository: event.repository,
      }),
      $set: {
        ...flattenKeys(event.sender),
      },
    },
  });
};

export const handleIssueCommentEvent = (
  event: WebhookEventMap["issue_comment"]
) => {
  phClient.capture({
    distinctId: event.sender.id.toString(),
    event: "github.issue_comment." + event.action,
    properties: {
      ...flattenKeys({
        comment: event.comment,
        issue: event.issue,
        repository: event.repository,
      }),
      $set: {
        ...flattenKeys(event.sender),
      },
    },
  });
};

export const handleStarEvent = (event: WebhookEventMap["star"]) => {
  phClient.capture({
    distinctId: event.sender.id.toString(),
    event: "github.star." + event.action,
    properties: {
      ...flattenKeys({
        repository: event.repository,
      }),
      starred_at: event.starred_at,
      $set: {
        ...flattenKeys(event.sender),
      },
    },
  });
};
