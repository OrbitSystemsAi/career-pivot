import "server-only";

import { createHash, createHmac } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { getVercelOidcToken } from "@vercel/oidc";
import type { OnnFeedSignal } from "../lib/onnFeedSignals";

export type CareerPivotFeedItem = {
  id: string;
  origin: "first_party" | "external_news";
  contentType: string;
  title: string;
  summary: string | null;
  url: string | null;
  imageUrl: string | null;
  publisher: { name: string; slug: string };
  publishedAt: string;
  provenance: { kind: "first_party" | "external_news"; sourceId: string; sourceName: string; originalUrl: string | null };
  relevanceScore: number;
};

export type CareerPivotFeed = {
  generatedAt: string;
  stale: boolean;
  partial: boolean;
  items: CareerPivotFeedItem[];
};

type FeedRequest = { topics: OnnFeedSignal[]; classifications: OnnFeedSignal[] };
type OnnEnvelope = { data?: { generatedAt?: string; partial?: boolean; items?: CareerPivotFeedItem[] }; error?: { code?: string; message?: string } };

const cacheDirectory = process.env.VERCEL
  ? path.join("/tmp", "career-pivot", "onn-feed-cache")
  : path.join(process.cwd(), ".data", "onn-feed-cache");

function configuration() {
  const publishingUrl = process.env.ONN_PUBLISHING_API_URL;
  const developmentBaseUrl = publishingUrl && process.env.NODE_ENV !== "production" ? new URL(publishingUrl).origin : undefined;
  const baseUrl = (process.env.ONN_FEED_API_BASE_URL ?? developmentBaseUrl)?.replace(/\/$/, "");
  const token = process.env.ONN_FEED_API_TOKEN ?? (process.env.NODE_ENV !== "production" ? process.env.ONN_PUBLISHING_API_TOKEN : undefined);
  if (!baseUrl || !token) throw new Error("ONN_NOT_CONFIGURED");
  return { baseUrl, token };
}

async function requestHeaders(token: string) {
  const headers: Record<string, string> = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  if (process.env.VERCEL) headers["x-vercel-trusted-oidc-idp-token"] = await getVercelOidcToken();
  return headers;
}

export function opaqueOnnUserId(email: string) {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === "production") throw new Error("AUTH_SESSION_SECRET is required in production.");
  return createHmac("sha256", secret ?? "career-pivot-development-session-secret-change-me").update(email.trim().toLowerCase()).digest("base64url");
}

function cachePath(externalUserId: string, request: FeedRequest) {
  const key = createHash("sha256").update(JSON.stringify([externalUserId, request])).digest("hex");
  return path.join(cacheDirectory, `${key}.json`);
}

async function readLastKnownGood(externalUserId: string, request: FeedRequest) {
  try {
    const cached = JSON.parse(await readFile(cachePath(externalUserId, request), "utf8")) as CareerPivotFeed;
    return { ...cached, stale: true };
  } catch {
    return null;
  }
}

async function writeLastKnownGood(externalUserId: string, request: FeedRequest, feed: CareerPivotFeed) {
  await mkdir(cacheDirectory, { recursive: true });
  const target = cachePath(externalUserId, request);
  const temporary = `${target}.${process.pid}.tmp`;
  await writeFile(temporary, JSON.stringify(feed), "utf8");
  await rename(temporary, target);
}

function validItem(value: unknown): value is CareerPivotFeedItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CareerPivotFeedItem>;
  return typeof item.id === "string" && (item.origin === "first_party" || item.origin === "external_news") && typeof item.title === "string" && typeof item.publishedAt === "string" && typeof item.publisher?.name === "string" && typeof item.provenance?.sourceName === "string" && typeof item.relevanceScore === "number";
}

function decodeEntities(value: string | null) {
  if (!value) return value;
  const named: Record<string, string> = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
  return value.replace(/&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi, (entity, decimal: string | undefined, hexadecimal: string | undefined, name: string | undefined) => {
    if (decimal) return String.fromCodePoint(Number(decimal));
    if (hexadecimal) return String.fromCodePoint(Number.parseInt(hexadecimal, 16));
    return name ? named[name.toLowerCase()] ?? entity : entity;
  }).replace(/\s+/g, " ").trim();
}

export async function loadOnnFeed(email: string, request: FeedRequest): Promise<CareerPivotFeed> {
  const externalUserId = opaqueOnnUserId(email);
  try {
    const { baseUrl, token } = configuration();
    const response = await fetch(`${baseUrl}/api/v1/feed/relevant`, {
      method: "POST",
      headers: await requestHeaders(token),
      body: JSON.stringify({ externalUserId, ...request, maximumItems: 8, maximumAgeHours: 168 }),
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    const payload = await response.json().catch(() => ({})) as OnnEnvelope;
    if (!response.ok || !Array.isArray(payload.data?.items)) throw new Error(payload.error?.code ?? `ONN_${response.status}`);
    if (!payload.data.items.every(validItem)) throw new Error("ONN_INVALID_RESPONSE");
    const items = payload.data.items.map((item) => ({ ...item, title: decodeEntities(item.title) ?? item.title, summary: decodeEntities(item.summary) }));
    const feed = { generatedAt: payload.data.generatedAt ?? new Date().toISOString(), stale: false, partial: payload.data.partial === true, items };
    await writeLastKnownGood(externalUserId, request, feed);
    return feed;
  } catch (error) {
    const cached = await readLastKnownGood(externalUserId, request);
    if (cached) return cached;
    throw error;
  }
}

export async function sendOnnFeedback(email: string, input: { itemType: "first_party" | "external_news"; itemId: string; interaction: "shown" | "opened" | "saved" | "dismissed" | "useful" | "not_relevant" }) {
  const { baseUrl, token } = configuration();
  const response = await fetch(`${baseUrl}/api/v1/feed/feedback`, {
    method: "POST",
    headers: await requestHeaders(token),
    body: JSON.stringify({ externalUserId: opaqueOnnUserId(email), ...input }),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`ONN_FEEDBACK_${response.status}`);
}
