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

  metrics: [
    { label: "Active Agents", value: "12", change: "↑ +4" },
    { label: "Tasks Run", value: "248", change: "↑ +31" },
    { label: "Opportunities", value: "24", change: "↑ +9" },
    { label: "Time Saved", value: "18h", change: "↑ +6h" },
  ],

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