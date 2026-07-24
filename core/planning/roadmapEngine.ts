import type {
  UserGoal,
  UserProfile,
  UserSubmittedEvidence,
} from "@/core/user/userTypes";
import type {
  EvidenceBackedPlan,
  GapStatus,
  PlanEvidence,
  PlanMilestone,
  PlanRequirement,
} from "@/core/planning/planningTypes";
import { collectUserEvidence } from "./evidenceEngine";

type RequirementSeed = Omit<
  PlanRequirement,
  "status" | "confidence" | "evidenceIds" | "reason"
>;

const commonRequirements: RequirementSeed[] = [
  {
    id: "target-definition",
    label: "Clear target definition",
    description: "A specific outcome with measurable success conditions.",
    importance: "required",
    keywords: ["goal", "target", "success"],
  },
  {
    id: "time-capacity",
    label: "Time and resource capacity",
    description: "Enough weekly capacity and financial stability to execute the transition.",
    importance: "required",
    keywords: ["time", "hours", "budget", "savings", "funding"],
  },
  {
    id: "proof",
    label: "Demonstrated proof",
    description: "Visible work, outcomes, credentials, or validation that supports the target.",
    importance: "important",
    keywords: ["portfolio", "project", "result", "experience", "certificate"],
  },
  {
    id: "relationships",
    label: "Relevant relationships",
    description: "People who can provide information, access, feedback, referrals, or customers.",
    importance: "important",
    keywords: ["network", "mentor", "referral", "customer", "partner"],
  },
];

const typeRequirements: Record<UserGoal["goalTypes"][number], RequirementSeed[]> = {
  employment: [
    { id: "role-skills", label: "Role capabilities", description: "Core skills demonstrated at the target level.", importance: "required", keywords: ["skill", "leadership", "operations", "strategy", "management"] },
    { id: "market-positioning", label: "Market positioning", description: "Résumé, profile, and narrative aligned to the target role.", importance: "important", keywords: ["resume", "profile", "title", "achievement"] },
  ],
  business: [
    { id: "customer-problem", label: "Validated customer problem", description: "Evidence that a defined customer values the problem being solved.", importance: "required", keywords: ["customer", "client", "problem", "interview", "demand"] },
    { id: "paid-offer", label: "Testable paid offer", description: "A specific offer, price, and delivery method ready for validation.", importance: "required", keywords: ["offer", "price", "service", "product", "revenue"] },
  ],
  creative: [
    { id: "creative-body", label: "Public body of work", description: "A coherent portfolio that demonstrates creative direction and consistency.", importance: "required", keywords: ["portfolio", "writing", "video", "performance", "design", "published"] },
    { id: "distribution", label: "Audience or access channel", description: "A repeatable method for reaching audiences, buyers, or decision makers.", importance: "important", keywords: ["audience", "subscriber", "audition", "agent", "distribution"] },
  ],
  education: [
    { id: "prerequisites", label: "Verified prerequisites", description: "Confirmed academic, admission, licensing, and location requirements.", importance: "required", keywords: ["degree", "course", "education", "prerequisite", "license", "certification"] },
    { id: "program-path", label: "Program and funding path", description: "A viable program choice with cost, schedule, and funding understood.", importance: "required", keywords: ["program", "school", "tuition", "funding", "scholarship"] },
  ],
  caregiving: [
    { id: "care-plan", label: "Sustainable care plan", description: "Responsibilities, schedule, support, benefits, and contingencies are defined.", importance: "required", keywords: ["care", "family", "schedule", "benefits", "support"] },
  ],
  lifestyle: [
    { id: "lifestyle-pilot", label: "Lifestyle pilot", description: "The desired schedule and location have been tested before irreversible changes.", importance: "important", keywords: ["remote", "travel", "schedule", "location", "pilot"] },
  ],
  portfolio: [
    { id: "anchor-income", label: "Anchor income", description: "At least one reliable income source supports the broader portfolio.", importance: "required", keywords: ["income", "client", "contract", "revenue", "role"] },
  ],
  retirement: [
    { id: "retirement-readiness", label: "Transition readiness", description: "Finances, benefits, health coverage, and post-work routines are stress-tested.", importance: "required", keywords: ["retirement", "savings", "benefits", "health", "income"] },
  ],
  custom: [
    { id: "validation", label: "Core assumption validated", description: "The riskiest assumption has been tested with credible evidence.", importance: "required", keywords: ["test", "validation", "evidence", "result"] },
  ],
};

function assessRequirement(
  seed: RequirementSeed,
  evidence: PlanEvidence[],
  goal: UserGoal,
  submittedEvidence: UserSubmittedEvidence[]
): PlanRequirement {
  if (submittedEvidence.length > 0) {
    const hasUserEvidence = submittedEvidence.some(
      (item) => !item.origin || item.origin === "user"
    );
    return {
      ...seed,
      status: hasUserEvidence ? "satisfied" : "partial",
      confidence: hasUserEvidence ? 0.9 : 0.72,
      evidenceIds: submittedEvidence.map((item) => item.id),
      reason: hasUserEvidence
        ? "User-submitted completion evidence directly supports this requirement."
        : "An accepted agent artifact supports preparation, but real-world outcome evidence is still required.",
    };
  }

  if (seed.id === "target-definition") {
    return {
      ...seed,
      status: goal.successCriteria.some((criterion) => criterion.accepted)
        ? "satisfied"
        : "partial",
      confidence: 0.95,
      evidenceIds: ["goal-intent"],
      reason: goal.successCriteria.some((criterion) => criterion.accepted)
        ? "The goal includes accepted success criteria."
        : "The direction is captured, but measurable success criteria are incomplete.",
    };
  }

  if (seed.id === "time-capacity") {
    const hasCapacity = Boolean(goal.availableHoursPerWeek);
    return {
      ...seed,
      status: hasCapacity ? "partial" : "unknown",
      confidence: hasCapacity ? 0.72 : 0.4,
      evidenceIds: evidence.filter((item) => item.source === "user_context").map((item) => item.id),
      reason: hasCapacity
        ? "Weekly capacity is known; financial and support capacity still need verification."
        : "Weekly capacity and financial runway have not been established.",
    };
  }

  const matches = evidence
    .filter((item) => item.source !== "user_submitted")
    .filter((item) =>
      seed.keywords.some((keyword) =>
        item.keywords.some(
          (evidenceKeyword) =>
            evidenceKeyword.includes(keyword) || keyword.includes(evidenceKeyword)
        )
      )
    );
  const strongest = Math.max(0, ...matches.map((item) => item.confidence));
  let status: GapStatus = "missing";
  if (matches.length >= 2 && strongest >= 0.8) status = "satisfied";
  else if (matches.length >= 2) status = "partial";
  else if (matches.length === 1) status = "transferable";

  return {
    ...seed,
    status,
    confidence: matches.length ? Math.min(0.92, strongest) : 0.7,
    evidenceIds: matches.map((item) => item.id),
    reason: matches.length
      ? `${matches.length} relevant evidence source${matches.length === 1 ? "" : "s"} found; confirm direct relevance to this target.`
      : "No relevant evidence is currently documented; this may be missing or simply not yet captured.",
  };
}

function taskForRequirement(
  requirement: PlanRequirement,
  _index: number,
  taskStatuses: UserProfile["planningProgress"]["taskStatuses"]
) {
  const unknown = requirement.status === "unknown";
  const storedStatus = taskStatuses[`task-${requirement.id}`];
  const resolvedStatus =
    storedStatus === "complete" && requirement.status !== "satisfied"
      ? "in_progress"
      : storedStatus ?? "not_started";
  return {
    id: `task-${requirement.id}`,
    title: unknown
      ? `Clarify ${requirement.label.toLowerCase()}`
      : `Build evidence for ${requirement.label.toLowerCase()}`,
    owner:
      requirement.id === "relationships" ||
      requirement.id === "market-positioning"
        ? ("agent" as const)
        : ("user" as const),
    estimatedHours: unknown ? 1 : 4,
    output: unknown
      ? `Documented facts and constraints for ${requirement.label.toLowerCase()}`
      : `A verifiable artifact or outcome demonstrating ${requirement.label.toLowerCase()}`,
    status: resolvedStatus,
  };
}

function buildMilestone(
  requirement: PlanRequirement,
  index: number,
  targetMonth: number,
  taskStatuses: UserProfile["planningProgress"]["taskStatuses"],
  previousId?: string
): PlanMilestone {
  const task = taskForRequirement(requirement, index, taskStatuses);
  return {
    id: `milestone-${requirement.id}`,
    title:
      requirement.status === "unknown"
        ? `Resolve ${requirement.label}`
        : `Establish ${requirement.label}`,
    outcome: requirement.description,
    targetMonth,
    requirementIds: [requirement.id],
    dependencyIds: previousId ? [previousId] : [],
    completionEvidence: [
      `Verified evidence changes ${requirement.label} from ${requirement.status} to satisfied.`,
    ],
    tasks: [task],
    status:
      task.status === "complete"
        ? "complete"
        : task.status === "in_progress"
          ? "in_progress"
          : "not_started",
  };
}

export function generateEvidenceBackedPlan(
  user: UserProfile,
  activeResumeId: string
): EvidenceBackedPlan | undefined {
  const goal = user.goals.find((item) => Boolean(item.setupCompletedAt));
  if (!goal) return undefined;

  const evidence = collectUserEvidence(user, activeResumeId);
  const goalType = goal.goalTypes[0] ?? "custom";
  const seeds = [...commonRequirements, ...typeRequirements[goalType]];
  const requirements = seeds.map((seed) =>
    assessRequirement(
      seed,
      evidence,
      goal,
      user.planningProgress.submittedEvidence.filter(
        (item) => item.goalId === goal.id && item.requirementId === seed.id
      )
    )
  );
  const unresolved = requirements.filter(
    (requirement) => requirement.status !== "satisfied"
  );
  const completedRequirements = requirements.filter(
    (requirement) =>
      requirement.status === "satisfied" &&
      requirement.evidenceIds.some((id) => id.startsWith("submitted-"))
  );
  const timeline = goal.guidance.recommendedTimelineMonths;
  const discoveryEnd = Math.max(1, Math.round(timeline * 0.15));
  const buildEnd = Math.max(discoveryEnd + 1, Math.round(timeline * 0.65));
  const discoveryRequirements = unresolved.filter(
    (requirement) => requirement.status === "unknown"
  );
  const buildRequirements = unresolved.filter(
    (requirement) => requirement.status !== "unknown"
  );
  let previousId: string | undefined;
  const makeMilestones = (items: PlanRequirement[], start: number, end: number) =>
    items.map((requirement, index) => {
      const month = Math.min(
        end,
        Math.max(start, start + Math.round(((end - start) * (index + 1)) / Math.max(1, items.length)))
      );
      const milestone = buildMilestone(
        requirement,
        index,
        month,
        user.planningProgress.taskStatuses,
        previousId
      );
      previousId = milestone.id;
      return milestone;
    });

  const completedMilestones = completedRequirements.map((requirement, index) =>
    buildMilestone(
      requirement,
      index,
      1,
      user.planningProgress.taskStatuses,
      undefined
    )
  );
  const activeDiscoveryMilestones = makeMilestones(
    discoveryRequirements.length ? discoveryRequirements : unresolved.slice(0, 1),
    1,
    discoveryEnd
  );
  const discoveryMilestones = [
    ...completedMilestones,
    ...activeDiscoveryMilestones,
  ];
  const usedIds = new Set(discoveryMilestones.flatMap((item) => item.requirementIds));
  const buildMilestones = makeMilestones(
    buildRequirements.filter((item) => !usedIds.has(item.id)),
    discoveryEnd + 1,
    buildEnd
  );
  const transitionMilestone: PlanMilestone = {
    id: "milestone-transition",
    title: "Validate transition readiness",
    outcome: "Confirm that success criteria, critical requirements, resources, and risks support the transition decision.",
    targetMonth: timeline,
    requirementIds: requirements.filter((item) => item.importance === "required").map((item) => item.id),
    dependencyIds: previousId ? [previousId] : [],
    completionEvidence: goal.successCriteria.filter((item) => item.accepted).map((item) => item.label),
    tasks: [
      {
        id: "task-readiness-review",
        title: "Run an evidence and readiness review",
        owner: "agent",
        estimatedHours: 1,
        output: "A decision brief comparing achieved evidence, remaining risks, and alternatives",
        status:
          user.planningProgress.taskStatuses["task-readiness-review"] ??
          "not_started",
      },
    ],
    status:
      user.planningProgress.taskStatuses["task-readiness-review"] === "complete"
        ? "complete"
        : user.planningProgress.taskStatuses["task-readiness-review"] ===
            "in_progress"
          ? "in_progress"
          : "not_started",
  };
  const evidenced = requirements.filter((item) => item.evidenceIds.length > 0).length;
  const satisfiedWeight = requirements.reduce((total, item) => {
    if (item.status === "satisfied") return total + 1;
    if (item.status === "partial" || item.status === "transferable") return total + 0.5;
    return total;
  }, 0);
  const phases = [
    {
      id: "phase-discover",
      title: "Clarify and verify",
      purpose: "Resolve unknowns and test the assumptions that could change the route.",
      startMonth: 1,
      endMonth: discoveryEnd,
      milestones: discoveryMilestones,
    },
    {
      id: "phase-build",
      title: "Build capability and proof",
      purpose: "Close priority gaps with observable work, credentials, relationships, and results.",
      startMonth: discoveryEnd + 1,
      endMonth: buildEnd,
      milestones: buildMilestones,
    },
    {
      id: "phase-transition",
      title: "Validate and transition",
      purpose: "Compare the evidence with the goal's success criteria before making the transition.",
      startMonth: buildEnd + 1,
      endMonth: timeline,
      milestones: [transitionMilestone],
    },
  ];
  const firstTask = phases
    .flatMap((phase) => phase.milestones)
    .flatMap((milestone) => milestone.tasks)
    .find((task) => task.status !== "complete");

  return {
    id: `plan-${goal.id}`,
    goalId: goal.id,
    generatedAt: new Date().toISOString(),
    evidence,
    requirements,
    phases,
    assumptions: goal.guidance.assumptions,
    risks: [
      goal.guidance.rating === "unlikely" || goal.guidance.rating === "high_risk"
        ? "The requested timing materially conflicts with the initial evidence-based planning range."
        : "The planning range may change as unknown requirements are verified.",
      evidence.length <= 2
        ? "The current plan has limited personal evidence and should be refined after profile or résumé evidence is added."
        : "Résumé evidence may not capture informal, portfolio, or recent experience.",
    ],
    nextAction: firstTask ?? transitionMilestone.tasks[0],
    evidenceCoverage: Math.round((evidenced / requirements.length) * 100),
    readiness: Math.round((satisfiedWeight / requirements.length) * 100),
  };
}
