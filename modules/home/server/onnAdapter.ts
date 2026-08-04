import "server-only";

import type { CareerPivotPost } from "../lib/postingTypes";

export class OnnSubmissionError extends Error {
  constructor(message: string, readonly retryable: boolean) {
    super(message);
  }
}

function topicSlug(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function toOnnSubmission(post: CareerPivotPost) {
  return {
    externalContentId: post.id,
    publicationSlug: "career-pivot-community",
    contentType: "article",
    title: post.title,
    summary: post.summary,
    body: post.body,
    language: "en",
    distributionLevel: post.distribution.audience === "public" ? "public" : "application",
    contributor: {
      externalContributorId: post.authorEmail,
      displayName: post.authorName,
      byline: post.authorName,
    },
    topics: post.topics.map((topic) => ({ slug: topicSlug(topic), weight: 1 })),
    citations: post.citations,
    metadata: { sourceApplication: "career-pivot", project: post.project, channels: post.distribution.channels },
  };
}

export async function submitToOnn(post: CareerPivotPost) {
  const endpoint = process.env.ONN_PUBLISHING_API_URL;
  const token = process.env.ONN_PUBLISHING_API_TOKEN;
  if (!endpoint || !token) throw new OnnSubmissionError("ONN submission is not configured. Add the server-only ONN publishing URL and token.", true);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `career-pivot:${post.id}`,
      },
      body: JSON.stringify(toOnnSubmission(post)),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new OnnSubmissionError("ONN could not be reached. Retry the submission.", true);
  }

  const responseBody = await response.json().catch(() => ({})) as { data?: { id?: string }; error?: { code?: string; message?: string } };
  if (!response.ok) {
    const retryable = response.status === 408 || response.status === 429 || response.status >= 500;
    throw new OnnSubmissionError(responseBody.error?.message ?? `ONN rejected the submission (${response.status}).`, retryable);
  }
  const submissionId = responseBody.data?.id;
  if (!submissionId) throw new OnnSubmissionError("ONN accepted the request without returning a submission ID.", true);
  return { submissionId };
}
