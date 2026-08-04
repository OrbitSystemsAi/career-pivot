import type { PostAudience, PostChannel, PostCitation, PostDraftInput } from "./postingTypes";

const audiences = new Set<PostAudience>(["public", "network", "groups"]);
const channels = new Set<PostChannel>(["onn", "career-pivot"]);

function text(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

export function parsePostInput(value: unknown): PostDraftInput {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const rawTopics = Array.isArray(input.topics) ? input.topics : [];
  const rawCitations = Array.isArray(input.citations) ? input.citations : [];
  const rawDistribution = input.distribution && typeof input.distribution === "object" ? input.distribution as Record<string, unknown> : {};
  const audience = audiences.has(rawDistribution.audience as PostAudience) ? rawDistribution.audience as PostAudience : "public";
  const selectedChannels = Array.isArray(rawDistribution.channels)
    ? rawDistribution.channels.filter((channel): channel is PostChannel => channels.has(channel as PostChannel))
    : [];

  return {
    project: text(input.project, 120),
    title: text(input.title, 100),
    summary: text(input.summary, 220),
    body: text(input.body, 5_000),
    topics: rawTopics.map((topic) => text(topic, 60)).filter(Boolean).slice(0, 12),
    citations: rawCitations.map((citation): PostCitation | null => {
      if (!citation || typeof citation !== "object") return null;
      const candidate = citation as Record<string, unknown>;
      const url = text(candidate.url, 2_000);
      if (!url) return null;
      return { label: text(candidate.label, 160) || url, url };
    }).filter((citation): citation is PostCitation => citation !== null).slice(0, 20),
    distribution: { audience, channels: [...new Set(selectedChannels)] },
  };
}

export function validateForSubmission(input: PostDraftInput) {
  const fields: Record<string, string> = {};
  if (!input.project) fields.project = "Select a project.";
  if (input.title.length < 5) fields.title = "Enter a title of at least 5 characters.";
  if (input.summary.length < 10) fields.summary = "Enter a summary of at least 10 characters.";
  if (input.body.length < 25) fields.body = "Enter a story of at least 25 characters.";
  if (input.topics.length === 0) fields.topics = "Add at least one topic.";
  if (!input.distribution.channels.includes("onn")) fields.distribution = "Select ONN as a distribution channel.";
  input.citations.forEach((citation, index) => {
    try {
      const url = new URL(citation.url);
      if (url.protocol !== 'https:') throw new Error();
    } catch {
      fields[`citations.${index}`] = "Citation URLs must use HTTPS.";
    }
  });
  return fields;
}
