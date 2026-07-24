export type EvidenceSource =
  | "profile"
  | "resume_experience"
  | "resume_education"
  | "resume_skill"
  | "resume_certification"
  | "user_goal"
  | "user_context"
  | "user_submitted";

export type EvidenceStrength = "strong" | "moderate" | "weak";

export type PlanEvidence = {
  id: string;
  claim: string;
  detail: string;
  source: EvidenceSource;
  sourceLabel: string;
  strength: EvidenceStrength;
  confidence: number;
  keywords: string[];
};

export type RequirementImportance = "required" | "important" | "helpful";
export type GapStatus =
  | "satisfied"
  | "transferable"
  | "partial"
  | "missing"
  | "unknown";

export type PlanRequirement = {
  id: string;
  label: string;
  description: string;
  importance: RequirementImportance;
  keywords: string[];
  status: GapStatus;
  confidence: number;
  evidenceIds: string[];
  reason: string;
};

export type PlanTask = {
  id: string;
  title: string;
  owner: "user" | "agent" | "professional";
  estimatedHours: number;
  output: string;
  status: "not_started" | "in_progress" | "complete";
};

export type PlanMilestone = {
  id: string;
  title: string;
  outcome: string;
  targetMonth: number;
  requirementIds: string[];
  dependencyIds: string[];
  completionEvidence: string[];
  tasks: PlanTask[];
  status: "not_started" | "in_progress" | "complete";
};

export type PlanPhase = {
  id: string;
  title: string;
  purpose: string;
  startMonth: number;
  endMonth: number;
  milestones: PlanMilestone[];
};

export type EvidenceBackedPlan = {
  id: string;
  goalId: string;
  generatedAt: string;
  evidence: PlanEvidence[];
  requirements: PlanRequirement[];
  phases: PlanPhase[];
  assumptions: string[];
  risks: string[];
  nextAction: PlanTask;
  evidenceCoverage: number;
  readiness: number;
};
