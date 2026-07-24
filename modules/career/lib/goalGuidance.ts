import type {
  FeasibilityRating,
  GoalGuidance,
  GoalPace,
  GoalType,
  SuccessCriterion,
  UserGoal,
} from "@/core/user/userTypes";

export type GoalDraft = {
  statement: string;
  goalType: GoalType;
  motivation: string;
  requestedTimelineMonths?: number;
  availableHoursPerWeek?: number;
  pace: GoalPace;
  urgencyReason?: string;
  constraints: string[];
  userSuccessCriteria: string[];
};

type GoalBlueprint = {
  minimumMonths: number;
  typicalMonths: number;
  criteria: string[];
  assumptions: string[];
  alternatives: string[];
};

const blueprints: Record<GoalType, GoalBlueprint> = {
  employment: {
    minimumMonths: 2,
    typicalMonths: 6,
    criteria: [
      "Define the role, work conditions, and minimum compensation you will accept.",
      "Demonstrate the target role's essential skills with credible evidence.",
      "Build a repeatable application and relationship-building process.",
    ],
    assumptions: ["The target role does not require a new regulated license."],
    alternatives: ["Use a bridge role to preserve income while building target experience."],
  },
  business: {
    minimumMonths: 3,
    typicalMonths: 12,
    criteria: [
      "Validate a specific customer problem with real prospects.",
      "Create and test a minimum viable paid offer.",
      "Define a sustainable revenue target and financial runway.",
    ],
    assumptions: ["The first version can be tested without major outside funding."],
    alternatives: ["Validate the offer alongside current employment before a full transition."],
  },
  creative: {
    minimumMonths: 4,
    typicalMonths: 18,
    criteria: [
      "Produce a public body of work that demonstrates your creative direction.",
      "Build a consistent practice and distribution or audition routine.",
      "Define the income mix that will make the creative path sustainable.",
    ],
    assumptions: ["Progress can begin through portfolio work before full-time income is available."],
    alternatives: ["Use a portfolio career while building reputation and demand."],
  },
  education: {
    minimumMonths: 6,
    typicalMonths: 24,
    criteria: [
      "Confirm admission, prerequisite, cost, and completion requirements.",
      "Select a program whose outcomes support the intended goal.",
      "Create a funding and weekly-time plan through completion.",
    ],
    assumptions: ["A suitable accredited or recognized program is available."],
    alternatives: ["Compare certificates, apprenticeships, and portfolio-based routes."],
  },
  caregiving: {
    minimumMonths: 1,
    typicalMonths: 6,
    criteria: [
      "Define the schedule and caregiving responsibilities the transition must support.",
      "Confirm income, benefits, and household coverage during the transition.",
      "Create a sustainable support and contingency plan.",
    ],
    assumptions: ["Household stakeholders can participate in transition planning."],
    alternatives: ["Explore flexible or reduced-hour work before a complete exit."],
  },
  lifestyle: {
    minimumMonths: 2,
    typicalMonths: 9,
    criteria: [
      "Translate the desired lifestyle into schedule, location, and income requirements.",
      "Test the lifestyle change before making irreversible commitments.",
      "Establish sustainable income, benefits, and contingency coverage.",
    ],
    assumptions: ["The desired lifestyle can be tested on a limited basis."],
    alternatives: ["Run a smaller pilot while preserving current income and benefits."],
  },
  portfolio: {
    minimumMonths: 3,
    typicalMonths: 12,
    criteria: [
      "Define the intended mix of roles, clients, businesses, or income streams.",
      "Validate at least one reliable anchor income source.",
      "Create capacity, scheduling, and risk limits for the full portfolio.",
    ],
    assumptions: ["At least one income stream can be developed before leaving current work."],
    alternatives: ["Start with one anchor role and one experimental income stream."],
  },
  retirement: {
    minimumMonths: 3,
    typicalMonths: 18,
    criteria: [
      "Define the financial, health coverage, and lifestyle conditions for the transition.",
      "Stress-test income and expenses under realistic scenarios.",
      "Plan the purpose, relationships, and routines that will replace current work.",
    ],
    assumptions: ["Financial details will be reviewed with an appropriate professional."],
    alternatives: ["Consider phased retirement or advisory work before a complete exit."],
  },
  custom: {
    minimumMonths: 3,
    typicalMonths: 12,
    criteria: [
      "Define observable conditions that would mean this goal has been achieved.",
      "Identify the strongest evidence, resources, and relationships already available.",
      "Test the highest-risk assumption before making an irreversible commitment.",
    ],
    assumptions: ["The goal can be divided into testable milestones."],
    alternatives: ["Begin with a low-cost experiment that tests the core assumption."],
  },
};

function isPhysicianGoal(statement: string) {
  return /\b(doctor|physician|surgeon)\b/i.test(statement);
}

function unique(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

export function buildGoalGuidance(draft: GoalDraft, profileAge?: number): {
  guidance: GoalGuidance;
  criteria: SuccessCriterion[];
} {
  const blueprint = blueprints[draft.goalType];
  const physicianGoal = isPhysicianGoal(draft.statement);
  const recommendedTimelineMonths = physicianGoal ? 84 : blueprint.typicalMonths;
  const requested = draft.requestedTimelineMonths;
  const minimumTimeline = physicianGoal ? 72 : blueprint.minimumMonths;
  let rating: FeasibilityRating = "feasible";

  if (requested && requested < minimumTimeline * 0.5) {
    rating = "unlikely";
  } else if (requested && requested < minimumTimeline) {
    rating = "high_risk";
  } else if (requested && requested < recommendedTimelineMonths) {
    rating = "aggressive";
  }

  const limitedTime =
    draft.availableHoursPerWeek !== undefined && draft.availableHoursPerWeek < 5;
  if (limitedTime && (rating === "feasible" || rating === "aggressive")) {
    rating = "high_risk";
  }

  const ageContext =
    profileAge && profileAge >= 70 && physicianGoal
      ? "At this life stage, the standard physician route carries a substantial time, cost, and training burden. Age alone does not define what you may pursue, but the plan should compare the full licensed path with adjacent ways to contribute to patient care."
      : "Your recommended pace reflects the target requirements, available weekly time, and transition urgency—not age alone.";

  const timelineContext = requested
    ? `You requested ${requested} month${requested === 1 ? "" : "s"}; an initial evidence-based planning range is about ${recommendedTimelineMonths} months.`
    : `An initial evidence-based planning range is about ${recommendedTimelineMonths} months and should be refined as prerequisites are confirmed.`;

  const physicianAssumptions = physicianGoal
    ? [
        "Becoming a licensed physician normally requires prerequisites, medical school admission, medical school, and supervised residency training.",
        "Requirements vary by location and must be verified before committing time or money.",
      ]
    : [];

  const physicianAlternatives = physicianGoal
    ? [
        "Compare physician assistant, nursing, public health, patient advocacy, clinical research, and healthcare education paths.",
      ]
    : [];

  const aiCriteria = unique([
    ...blueprint.criteria,
    ...(physicianGoal
      ? ["Verify every academic, admission, licensing, and residency requirement for the intended location."]
      : []),
  ]);
  const allCriteria = [
    ...unique(draft.userSuccessCriteria).map((label, index) => ({
      id: `user-${index}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24)}`,
      label,
      source: "user" as const,
      accepted: true,
    })),
    ...aiCriteria.map((label, index) => ({
      id: `ai-${index}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24)}`,
      label,
      source: "ai" as const,
      accepted: true,
    })),
  ];

  return {
    criteria: allCriteria,
    guidance: {
      rating,
      summary: `${timelineContext} ${ageContext}`,
      recommendedTimelineMonths,
      requestedTimelineMonths: requested,
      assumptions: unique([...blueprint.assumptions, ...physicianAssumptions]),
      alternatives: unique([...physicianAlternatives, ...blueprint.alternatives]),
      generatedAt: new Date().toISOString(),
    },
  };
}

export function createGoalFromDraft(draft: GoalDraft, profileAge?: number): UserGoal {
  const now = new Date().toISOString();
  const { criteria, guidance } = buildGoalGuidance(draft, profileAge);

  return {
    id: `goal-${Date.now()}`,
    title: draft.statement.trim(),
    statement: draft.statement.trim(),
    goalTypes: [draft.goalType],
    motivation: draft.motivation.trim(),
    status: draft.pace === "explore" ? "exploring" : "active",
    pace: draft.pace,
    requestedTimelineMonths: draft.requestedTimelineMonths,
    availableHoursPerWeek: draft.availableHoursPerWeek,
    urgencyReason: draft.urgencyReason?.trim() || undefined,
    constraints: unique(draft.constraints),
    successCriteria: criteria,
    guidance,
    setupCompletedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}
