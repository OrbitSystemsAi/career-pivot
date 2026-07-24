import type { ModuleDefinition } from "@/core/types/module";

import {
  CareerGraph,
  CareerMarket,
  CareerTimeline,
  CareerSkills,
  CareerStrengths,
  CareerSuggestions,
  CareerWords,
  CareerFilters,
  CareerPath,
  CareerCompanies,
  CareerMarketDemand,
  CareerMarketCompanies,
  CareerMarketActions,
  CareerMarketFilters,
  CareerMarketContext,
  CareerMarketRanking,
  GoalCreation,
  EvidencePlan,
  CareerAssumptionsPanel,
  CareerRiskSignalsPanel,
  CareerDecisionPanel,
} from "@/modules/career";

export const careerModule: ModuleDefinition = {
  id: "career",
  name: "Career",
  description: "Career Intelligence",
  icon: "🚀",

  metrics: [
    { label: "Current Career", value: "0%" },
    { label: "Selected Career", value: "0%" },
    { label: "Next Titles", value: "0" },
    { label: "Resume Skills", value: "0" },
  ],

  views: [
    { label: "Goal", id: "goal" },
    { label: "Paths", id: "market" },
    { label: "Plan", id: "plan" },
    { label: "Graph", id: "graph" },
    { label: "Timeline", id: "timeline" },
    { label: "Skills", id: "skills" },
  ],

  panels: {
    visualization: CareerGraph,

    utilityTop: CareerFilters,
    utilityMiddle: CareerPath,
    utilityBottom: CareerCompanies,

    bottomLeft: CareerStrengths,
    bottomCenter: CareerSuggestions,
    bottomRight: CareerWords,
  },

  viewPanels: {
    goal: {
      visualization: GoalCreation,
    },
    plan: {
      visualization: EvidencePlan,
    },
    timeline: {
      visualization: CareerTimeline,
      utilityTop: CareerAssumptionsPanel,
      utilityMiddle: CareerRiskSignalsPanel,
      utilityBottom: CareerDecisionPanel,
    },
    graph: {
      utilityTop: CareerAssumptionsPanel,
      utilityMiddle: CareerRiskSignalsPanel,
      utilityBottom: CareerDecisionPanel,
    },

    market: {
      visualization: CareerMarket,
      utilityTop: CareerMarketFilters,
      utilityMiddle: CareerMarketContext,
      utilityBottom: CareerMarketRanking,

      bottomLeft: CareerMarketDemand,
      bottomCenter: CareerMarketCompanies,
      bottomRight: CareerMarketActions,
    },

    skills: {
      visualization: CareerSkills,
    },
  },
};
