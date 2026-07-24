export type OpportunityType =
  | "job"
  | "business_lead"
  | "creative"
  | "education"
  | "lifestyle"
  | "partnership";

export type GoalOpportunity = {
  id: string;
  type: OpportunityType;
  title: string;
  organization: string;
  description: string;
  location: string;
  timing: string;
  value: string;
  sourceLabel: string;
  sourceUrl?: string;
  live: boolean;
  requirementIds: string[];
  fitReasons: string[];
  gaps: string[];
  recommendedAction: string;
};

export type OpportunityScoreKey =
  | "career"
  | "experience"
  | "education"
  | "certifications"
  | "resume";

export type OpportunityScore = {
  key: OpportunityScoreKey;
  label: string;
  value: number | null;
  explanation: string;
};

export type CareerJobOpportunity = {
  id: string;
  pathId: string;
  title: string;
  organization: string;
  location: string;
  workMode: "Remote" | "Hybrid" | "On-site";
  employmentType: "Full-time" | "Contract";
  salary: string;
  postedLabel: string;
  sourceLabel: string;
  live: boolean;
  overallScore: number;
  evidenceCoverage: number;
  scores: OpportunityScore[];
  fitReasons: string[];
  gaps: string[];
  description: string;
};

export type CareerOpportunityPath = {
  id: string;
  label: string;
  choiceNumber: number;
  jobs: CareerJobOpportunity[];
};

export type OpportunityPrerequisite = {
  key: "goal" | "paths" | "resume";
  label: "Career Goals" | "Career Paths" | "Upload Resume";
  complete: boolean;
};

export type CareerOpportunityIntelligence = {
  prerequisites: OpportunityPrerequisite[];
  isReady: boolean;
  paths: CareerOpportunityPath[];
  totalJobs: number;
  scoredJobs: number;
  bestScore: number | null;
  hasResume: boolean;
  resumeLabel?: string;
};
