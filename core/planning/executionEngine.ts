import type { AgentArtifact, UserGoal } from "@/core/user/userTypes";
import type { PlanTask } from "./planningTypes";

function artifactContent(requirementId: string, goal: UserGoal) {
  if (requirementId === "relationships") {
    return [
      `Identify 10 people connected to: ${goal.statement}`,
      "Prioritize people who can validate requirements, provide access, or offer direct feedback.",
      "For each person, record the relationship path, reason to contact, and a personalized opening.",
      "Draft outreach for user review; do not send messages automatically.",
    ];
  }

  if (requirementId === "market-positioning") {
    return [
      `Compare the user's current positioning with the target: ${goal.statement}`,
      "Identify three strongest transferable accomplishments.",
      "Draft a concise target narrative supported only by documented evidence.",
      "List claims that require user confirmation before résumé or profile use.",
    ];
  }

  return [
    `Research the current requirements for: ${goal.statement}`,
    "Separate verified facts from assumptions and unresolved questions.",
    "Produce a concise decision brief with sources to verify before action.",
    "Recommend the smallest next experiment that creates useful evidence.",
  ];
}

export function createAgentArtifact(
  goal: UserGoal,
  task: PlanTask,
  requirementId: string
): AgentArtifact {
  const createdAt = new Date().toISOString();

  return {
    id: `artifact-${Date.now()}`,
    goalId: goal.id,
    taskId: task.id,
    requirementId,
    title: `${task.title}: agent draft`,
    summary: `A reviewable working draft for ${task.output.toLowerCase()}.`,
    content: artifactContent(requirementId, goal),
    status: "draft",
    createdAt,
  };
}
