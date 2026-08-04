export type PostAudience = "public" | "network" | "groups";
export type PostChannel = "onn" | "career-pivot";
export type PostStatus = "draft" | "submitting" | "submitted" | "failed";

export type PostCitation = { label: string; url: string };
export type PostDistribution = { audience: PostAudience; channels: PostChannel[] };

export type PostDraftInput = {
  project: string;
  title: string;
  summary: string;
  body: string;
  topics: string[];
  citations: PostCitation[];
  distribution: PostDistribution;
};

export type CareerPivotPost = PostDraftInput & {
  id: string;
  authorEmail: string;
  authorName: string;
  status: PostStatus;
  submissionAttempts: number;
  lastError?: string;
  onnSubmissionId?: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
};

export type PostApiError = { error: string; fields?: Record<string, string> };
