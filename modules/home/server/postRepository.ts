import "server-only";

import { randomUUID } from "node:crypto";
import { mutateData, queryData, type StoredPost } from "@/core/server/dataStore";
import type { CareerPivotPost, PostDraftInput } from "../lib/postingTypes";

function publicPost(post: StoredPost): CareerPivotPost {
  return { ...post };
}

export async function listPosts(authorEmail: string) {
  return queryData((data) => data.posts
    .filter((post) => post.authorEmail === authorEmail)
    .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt))
    .map(publicPost));
}

export async function getPost(id: string, authorEmail: string) {
  return queryData((data) => {
    const post = data.posts.find((candidate) => candidate.id === id && candidate.authorEmail === authorEmail);
    return post ? publicPost(post) : null;
  });
}

export async function savePost(input: PostDraftInput, author: { email: string; name: string }, id?: string) {
  return mutateData((data) => {
    const now = new Date().toISOString();
    const existing = id ? data.posts.find((post) => post.id === id && post.authorEmail === author.email) : undefined;
    if (id && !existing) throw new Error("POST_NOT_FOUND");
    if (existing?.status === "submitted") throw new Error("POST_ALREADY_SUBMITTED");

    if (existing) {
      Object.assign(existing, input, { authorName: author.name, status: "draft" as const, updatedAt: now, lastError: undefined });
      return publicPost(existing);
    }

    const post: StoredPost = {
      id: randomUUID(),
      authorEmail: author.email,
      authorName: author.name,
      ...input,
      status: "draft",
      submissionAttempts: 0,
      createdAt: now,
      updatedAt: now,
    };
    data.posts.push(post);
    return publicPost(post);
  });
}

export async function markSubmitting(id: string, authorEmail: string) {
  return mutateData((data) => {
    const post = data.posts.find((candidate) => candidate.id === id && candidate.authorEmail === authorEmail);
    if (!post) throw new Error("POST_NOT_FOUND");
    if (post.status === "submitted") throw new Error("POST_ALREADY_SUBMITTED");
    post.status = "submitting";
    post.submissionAttempts += 1;
    post.lastError = undefined;
    post.updatedAt = new Date().toISOString();
    return publicPost(post);
  });
}

export async function markSubmitted(id: string, authorEmail: string, onnSubmissionId: string) {
  return mutateData((data) => {
    const post = data.posts.find((candidate) => candidate.id === id && candidate.authorEmail === authorEmail);
    if (!post) throw new Error("POST_NOT_FOUND");
    const now = new Date().toISOString();
    post.status = "submitted";
    post.onnSubmissionId = onnSubmissionId;
    post.submittedAt = now;
    post.updatedAt = now;
    post.lastError = undefined;
    return publicPost(post);
  });
}

export async function markFailed(id: string, authorEmail: string, message: string) {
  return mutateData((data) => {
    const post = data.posts.find((candidate) => candidate.id === id && candidate.authorEmail === authorEmail);
    if (!post) throw new Error("POST_NOT_FOUND");
    post.status = "failed";
    post.lastError = message.slice(0, 500);
    post.updatedAt = new Date().toISOString();
    return publicPost(post);
  });
}

export async function deletePost(id: string, authorEmail: string) {
  return mutateData((data) => {
    const index = data.posts.findIndex((post) => post.id === id && post.authorEmail === authorEmail);
    if (index === -1) throw new Error("POST_NOT_FOUND");
    if (data.posts[index].status === "submitted") throw new Error("POST_ALREADY_SUBMITTED");
    data.posts.splice(index, 1);
  });
}
