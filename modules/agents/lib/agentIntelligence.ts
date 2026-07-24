import type { UserProfile } from "@/core/user/userTypes";

export function getAgentIntelligence(user: UserProfile) {
  const recruitedAgents = user.agentWorkforce?.recruitedAgents ?? [];
  const taskRuns = user.agentWorkforce?.taskRuns ?? [];
  const completedRuns = taskRuns.filter((run) => run.status === "completed");

  return {
    recruitedAgents,
    taskRuns,
    activeAgents: recruitedAgents.filter((agent) => agent.status === "active")
      .length,
    completedTasks: completedRuns.length,
    opportunitiesFound: completedRuns.reduce(
      (total, run) => total + run.opportunitiesFound,
      0
    ),
    timeSavedMinutes: completedRuns.reduce(
      (total, run) => total + run.timeSavedMinutes,
      0
    ),
  };
}
