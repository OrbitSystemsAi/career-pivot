import type { ParsedResumeDocument } from "@/core/resumeParsing/parsedResumeTypes";

export type GoalType =
  | "employment"
  | "business"
  | "creative"
  | "education"
  | "caregiving"
  | "lifestyle"
  | "portfolio"
  | "retirement"
  | "custom";

export type GoalPace =
  | "explore"
  | "gradual"
  | "balanced"
  | "accelerated"
  | "urgent";

export type FeasibilityRating =
  | "feasible"
  | "aggressive"
  | "high_risk"
  | "unlikely"
  | "structurally_blocked";

export type SuccessCriterion = {
  id: string;
  label: string;
  source: "user" | "ai";
  accepted: boolean;
};

export type GoalGuidance = {
  rating: FeasibilityRating;
  summary: string;
  recommendedTimelineMonths: number;
  requestedTimelineMonths?: number;
  assumptions: string[];
  alternatives: string[];
  generatedAt: string;
};

export type UserGoal = {
  id: string;
  title: string;
  statement: string;
  goalTypes: GoalType[];
  motivation: string;
  status: "exploring" | "committed" | "active" | "paused" | "achieved";
  pace: GoalPace;
  requestedTimelineMonths?: number;
  availableHoursPerWeek?: number;
  urgencyReason?: string;
  constraints: string[];
  successCriteria: SuccessCriterion[];
  guidance: GoalGuidance;
  setupCompletedAt?: string;
  createdAt: string;
  updatedAt: string;
  industry?: string;
  seniority?: string;
  workPreference?: "remote" | "hybrid" | "onsite" | "flexible";
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

export type UserIndustryJobHistory = {
  id: string;
  industry: string;
  title: string;
  company: string;
  startDate?: string;
  endDate?: string;
};

export type ReviewerProfile = {
  isReviewer: boolean;
  reviewIndustries: string[];
  reviewSeniority: string[];
  creditsEarned: number;
  creditsAvailable: number;
};

export type CareerPreference = {
  selectedCareerId?: string;
  selectedCareerIds?: string[];
  selectionConfirmedAt?: string;
};

export type UserSubmittedEvidence = {
  id: string;
  goalId: string;
  requirementId: string;
  taskId: string;
  claim: string;
  detail: string;
  origin: "user" | "agent_artifact";
  createdAt: string;
};

export type AgentArtifact = {
  id: string;
  goalId: string;
  taskId: string;
  requirementId: string;
  title: string;
  summary: string;
  content: string[];
  status: "draft" | "accepted" | "rejected";
  createdAt: string;
};

export type PlanningProgress = {
  taskStatuses: Record<string, "not_started" | "in_progress" | "complete">;
  submittedEvidence: UserSubmittedEvidence[];
  agentArtifacts: AgentArtifact[];
};

export type OpportunityProgress = {
  savedOpportunityIds: string[];
  dismissedOpportunityIds: string[];
};

export type NetworkSource = "linkedin" | "osai";

export type UserNetworkConnection = {
  id: string;
  source: NetworkSource;
  name: string;
  headline?: string;
  company?: string;
  relationship: "new" | "active" | "warm";
  addedAt: string;
};

export type UserNetwork = {
  connectedSources: NetworkSource[];
  connections: UserNetworkConnection[];
};

export type AgentRole =
  | "opportunity"
  | "resume_writer"
  | "outreach"
  | "network_builder";

export type RecruitedAgent = {
  id: string;
  role: AgentRole;
  name: string;
  status: "active" | "paused";
  recruitedAt: string;
};

export type AgentTaskRun = {
  id: string;
  agentId: string;
  status: "queued" | "running" | "completed" | "failed";
  opportunitiesFound: number;
  timeSavedMinutes: number;
  createdAt: string;
};

export type AgentWorkforce = {
  recruitedAgents: RecruitedAgent[];
  taskRuns: AgentTaskRun[];
};

export type OnboardingPrimaryIntent =
  | "find_job"
  | "change_career"
  | "build_business"
  | "explore"
  | "reshape_life_work";

export type OnboardingGoalDirection =
  | "pursue_new_title"
  | "find_better_job"
  | "change_careers"
  | "return_to_work"
  | "work_from_home"
  | "work_remote"
  | "work_abroad"
  | "relocate"
  | "start_business"
  | "grow_business"
  | "build_multiple_businesses"
  | "independent_work"
  | "start_family"
  | "become_stay_at_home_parent"
  | "work_around_caregiving"
  | "create_more_life_space"
  | "explore_possibilities";

export type OnboardingVisionMilestone = {
  id: string;
  vision: string;
  timing: string;
};

export type OnboardingDraft = {
  step: 0 | 1 | 2 | 3;
  name: string;
  age: string;
  location: string;
  currentTitle: string;
  currentIndustry: string;
  originalVisionMilestones: OnboardingVisionMilestone[];
  originalVisionMotivations: string[];
  originalVisionEnduringElements: string;
  originalVisionTurningPoints: string;
  originalVisionAlternativePath: string;
  originalVisionCurrentFeeling: string;
  currentSituations: string[];
  previousRoleExperience: string;
  returnToPreviousWork: string;
  currentCommitments: string[];
  currentEmotionalSignals: string[];
  financialUrgency: string;
  changeCapacity: string;
  pivotReadiness: string;
  currentConstraints: string;
  currentSupport: string;
  primaryIntent: OnboardingPrimaryIntent | null;
  goalDirections: OnboardingGoalDirection[];
  primaryGoalDirection: OnboardingGoalDirection | null;
  targetStatement: string;
  workPreference: "remote" | "hybrid" | "onsite" | "flexible";
  updatedAt: string;
};

export type UserProfile = {
  id: string;
  name: string;
  age?: number;
  profileImage?: string;
  headline?: string;
  yearsExperience?: number;
  highlights: string[];
  location: string;
  currentTitle: string;
  currentIndustry: string;
  targetIndustries: string[];
  skills: string[];
  goals: UserGoal[];
  resumes: UserResume[];
  industryHistory?: UserIndustryJobHistory[];
  industryHistoryResumeId?: string;
  careerPreference: CareerPreference;
  planningProgress: PlanningProgress;
  opportunityProgress: OpportunityProgress;
  network: UserNetwork;
  agentWorkforce: AgentWorkforce;
  reviewerProfile: ReviewerProfile;
  onboardingDraft?: OnboardingDraft;
  onboarding?: {
    primaryIntent: OnboardingPrimaryIntent;
    goalDirections?: OnboardingGoalDirection[];
    primaryGoalDirection?: OnboardingGoalDirection;
    originalVision?: string;
    originalVisionTiming?: string;
    originalVisionMilestones?: OnboardingVisionMilestone[];
    originalVisionMotivations?: string[];
    originalVisionEnduringElements?: string;
    originalVisionTurningPoints?: string;
    originalVisionAlternativePath?: string;
    originalVisionCurrentFeeling?: string;
    currentSituations?: string[];
    previousRoleExperience?: string;
    returnToPreviousWork?: string;
    currentCommitments?: string[];
    currentEmotionalSignals?: string[];
    financialUrgency?: string;
    changeCapacity?: string;
    pivotReadiness?: string;
    currentConstraints?: string;
    currentSupport?: string;
    targetStatement?: string;
    workPreference: "remote" | "hybrid" | "onsite" | "flexible";
    completedAt: string;
  };
};
