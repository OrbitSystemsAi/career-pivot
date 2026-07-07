import type { ParsedResumeDocument } from "@/core/resumeParsing/parsedResumeTypes";

export type UserGoal = {
  id: string;
  title: string;
  industry: string;
  seniority: string;
  workPreference: "remote" | "hybrid" | "onsite" | "flexible";
};

export type ResumeParseStatus =
  | "mock"
  | "uploaded"
  | "queued"
  | "parsed"
  | "needs_review";

export type ResumeVersion = {
  id: string;
  label: string;
  source: "original" | "upload" | "ai_optimized" | "manual_edit";
  createdDate: string;
  isCurrent: boolean;
  parsedDocument?: ParsedResumeDocument;
};

export type UserResume = {
  id: string;
  name: string;
  targetGoalId: string;
  targetJobTitle?: string;
  status: "draft" | "active" | "archived";
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  source: "mock" | "upload" | "generated";
  version: number;
  createdDate: string;
  parseStatus: ResumeParseStatus;
  currentVersionId: string;
  versions: ResumeVersion[];
};

export type ReviewerProfile = {
  isReviewer: boolean;
  reviewIndustries: string[];
  reviewSeniority: string[];
  creditsEarned: number;
  creditsAvailable: number;
};

export type UserProfile = {
  id: string;
  name: string;
  location: string;
  currentTitle: string;
  currentIndustry: string;
  targetIndustries: string[];
  skills: string[];
  goals: UserGoal[];
  resumes: UserResume[];
  reviewerProfile: ReviewerProfile;
};