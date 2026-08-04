import "server-only";

import { randomUUID } from "node:crypto";
import { findStoredPost, listStoredPosts, removeStoredPost, upsertStoredPost, type StoredPost } from "@/core/server/dataStore";
import type { CareerPivotPost, PostDraftInput } from "../lib/postingTypes";

function publicPost(post: StoredPost): CareerPivotPost {
  return { ...post };
}

export async function listPosts(authorEmail: string) {
  return (await listStoredPosts(authorEmail)).map(publicPost);
}

export async function getPost(id: string, authorEmail: string) {
  const post = await findStoredPost(id, authorEmail);
  return post ? publicPost(post) : null;
}

export async function savePost(input: PostDraftInput, author: { email: string; name: string }, id?: string) {
  const now = new Date().toISOString();
  const existing = id ? await findStoredPost(id, author.email) : undefined;
  if (id && !existing) throw new Error("POST_NOT_FOUND");
  if (existing?.status === "submitted") throw new Error("POST_ALREADY_SUBMITTED");
  const post: StoredPost = existing
    ? { ...existing, ...input, authorName: author.name, status: "draft", updatedAt: now, lastError: undefined }
    : { id: randomUUID(), authorEmail: author.email, authorName: author.name, ...input, status: "draft", submissionAttempts: 0, createdAt: now, updatedAt: now };
  return publicPost(await upsertStoredPost(post));
}

export async function markSubmitting(id: string, authorEmail: string) {
  const post = await findStoredPost(id, authorEmail);
  if (!post) throw new Error("POST_NOT_FOUND");
  if (post.status === "submitted") throw new Error("POST_ALREADY_SUBMITTED");
  return publicPost(await upsertStoredPost({ ...post, status: "submitting", submissionAttempts: post.submissionAttempts + 1, lastError: undefined, updatedAt: new Date().toISOString() }));
}

export async function markSubmitted(id: string, authorEmail: string, onnSubmissionId: string) {
  const post = await findStoredPost(id, authorEmail);
  if (!post) throw new Error("POST_NOT_FOUND");
  const now = new Date().toISOString();
  return publicPost(await upsertStoredPost({ ...post, status: "submitted", onnSubmissionId, submittedAt: now, updatedAt: now, lastError: undefined }));
}

export async function markFailed(id: string, authorEmail: string, message: string) {
  const post = await findStoredPost(id, authorEmail);
  if (!post) throw new Error("POST_NOT_FOUND");
  return publicPost(await upsertStoredPost({ ...post, status: "failed", lastError: message.slice(0, 500), updatedAt: new Date().toISOString() }));
}

export async function deletePost(id: string, authorEmail: string) {
  const post = await findStoredPost(id, authorEmail);
  if (!post) throw new Error("POST_NOT_FOUND");
  if (post.status === "submitted") throw new Error("POST_ALREADY_SUBMITTED");
  if (!(await removeStoredPost(id, authorEmail))) throw new Error("POST_NOT_FOUND");
}
