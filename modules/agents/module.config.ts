import type { ModuleDefinition } from "@/core/types/module";

import {
  AgentsModule,
  AgentFilters,
  AgentContext,
  AgentResults,
  AgentInsights,
  AgentQueue,
  AgentActions,
} from "@/modules/agents";

export const agentsModule: ModuleDefinition = {
  id: "agents",
  name: "Agents",
  description: "Agent Intelligence",
  icon: "🤖",

  metrics: [],

  views: [
    { label: "Overview", id: "overview" },
    { label: "Agents", id: "agents" },
    { label: "Tasks", id: "tasks" },
    { label: "Logs", id: "logs" },
  ],

  panels: {
    visualization: AgentsModule,

    utilityTop: AgentFilters,
    utilityMiddle: AgentContext,
    utilityBottom: AgentResults,

    bottomLeft: AgentInsights,
    bottomCenter: AgentQueue,
    bottomRight: AgentActions,
  },
};
