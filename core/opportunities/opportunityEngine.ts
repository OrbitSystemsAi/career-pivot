import type { UserGoal } from "@/core/user/userTypes";
import type {
  GoalOpportunity,
  OpportunityType,
} from "./opportunityTypes";

type OpportunitySeed = Omit<GoalOpportunity, "fitReasons" | "gaps"> & {
  goalTypes: UserGoal["goalTypes"];
};

const seeds: OpportunitySeed[] = [
  {
    id: "job-remote-operations",
    type: "job",
    title: "Remote Operations Leadership Roles",
    organization: "Target-company research set",
    description: "A research queue for remote operations and transformation roles that can preserve income during a transition.",
    location: "Remote",
    timing: "Review weekly",
    value: "Income bridge",
    sourceLabel: "Curated prototype",
    live: false,
    requirementIds: ["role-skills", "market-positioning"],
    recommendedAction: "Compare three representative roles with documented experience.",
    goalTypes: ["employment", "lifestyle", "portfolio"],
  },
  {
    id: "lead-discovery-interviews",
    type: "business_lead",
    title: "Customer Discovery Interview Leads",
    organization: "Local and professional network",
    description: "Potential buyers or operators to interview before defining a consulting offer.",
    location: "User network",
    timing: "Next 14 days",
    value: "Demand validation",
    sourceLabel: "Curated prototype",
    live: false,
    requirementIds: ["customer-problem", "relationships"],
    recommendedAction: "Identify ten prospects and request five problem interviews.",
    goalTypes: ["business", "portfolio"],
  },
  {
    id: "lead-pilot-client",
    type: "business_lead",
    title: "Pilot Client Candidates",
    organization: "Small-business target segment",
    description: "A lead-building brief for finding organizations that could test a narrowly scoped paid offer.",
    location: "Flexible",
    timing: "After discovery interviews",
    value: "First revenue",
    sourceLabel: "Curated prototype",
    live: false,
    requirementIds: ["paid-offer", "proof"],
    recommendedAction: "Define the pilot outcome, price, and qualification criteria.",
    goalTypes: ["business"],
  },
  {
    id: "creative-portfolio-brief",
    type: "creative",
    title: "Portfolio Commission Briefs",
    organization: "Self-directed proof projects",
    description: "Realistic creative briefs designed to produce target-relevant public portfolio evidence.",
    location: "Remote",
    timing: "Start this month",
    value: "Portfolio proof",
    sourceLabel: "Curated prototype",
    live: false,
    requirementIds: ["creative-body", "proof"],
    recommendedAction: "Select one brief with a two-week publication deadline.",
    goalTypes: ["creative", "portfolio"],
  },
  {
    id: "creative-collaboration",
    type: "partnership",
    title: "Creative Collaboration Targets",
    organization: "Peer and community research set",
    description: "Potential collaborators whose audience, medium, or production capability complements the goal.",
    location: "Hybrid / remote",
    timing: "After first portfolio piece",
    value: "Audience access",
    sourceLabel: "Curated prototype",
    live: false,
    requirementIds: ["distribution", "relationships"],
    recommendedAction: "Draft a contribution-first collaboration proposal.",
    goalTypes: ["creative", "portfolio"],
  },
  {
    id: "education-prerequisite-audit",
    type: "education",
    title: "Accredited Program Prerequisite Audit",
    organization: "Program research queue",
    description: "Compare admission, prerequisite, licensing, cost, and completion requirements across programs.",
    location: "Target location required",
    timing: "Before applying",
    value: "Verified route",
    sourceLabel: "Curated prototype",
    live: false,
    requirementIds: ["prerequisites", "program-path"],
    recommendedAction: "Select three accredited programs and verify requirements directly.",
    goalTypes: ["education"],
  },
  {
    id: "lifestyle-pilot",
    type: "lifestyle",
    title: "Four-Week Lifestyle Pilot",
    organization: "Self-directed experiment",
    description: "Test the desired schedule, location flexibility, responsibilities, and income assumptions before a larger commitment.",
    location: "Current location",
    timing: "Next available month",
    value: "Risk reduction",
    sourceLabel: "Curated prototype",
    live: false,
    requirementIds: ["lifestyle-pilot", "time-capacity"],
    recommendedAction: "Define the pilot schedule and three observable success measures.",
    goalTypes: ["lifestyle", "caregiving", "retirement"],
  },
];

function typeLabel(type: OpportunityType) {
  return type.replaceAll("_", " ");
}

export function getGoalOpportunities(goal: UserGoal): GoalOpportunity[] {
  const primaryType = goal.goalTypes[0] ?? "custom";
  const matches = seeds.filter((seed) => seed.goalTypes.includes(primaryType));
  const selected = matches.length ? matches : seeds.filter((seed) => seed.type === "partnership");

  return selected.map(({ goalTypes, ...seed }) => ({
    ...seed,
    fitReasons: [
      goalTypes.includes(primaryType)
        ? `Designed for a ${primaryType} goal.`
        : `Provides an adjacent path for this ${primaryType} goal.`,
      `Supports ${seed.requirementIds.length} roadmap requirement${seed.requirementIds.length === 1 ? "" : "s"}.`,
      goal.constraints.length
        ? `Can be evaluated against ${goal.constraints.length} saved constraint${goal.constraints.length === 1 ? "" : "s"}.`
        : `Creates evidence before a larger commitment.`,
    ],
    gaps: seed.live
      ? []
      : [`${typeLabel(seed.type)} details and availability must be verified before action.`],
  }));
}
