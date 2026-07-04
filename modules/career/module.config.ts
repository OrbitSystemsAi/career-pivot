import type { ModuleDefinition } from "@/core/types/module";

import {
  CareerGraph,
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
} from "@/modules/career";

export const careerModule: ModuleDefinition = {
  id: "career",
  name: "Career",
  description: "Career Intelligence",
  icon: "🚀",

  metrics: [
    { label: "Career Match", value: "72%", change: "↑ +12%" },
    { label: "Market Reach", value: "1.2K", change: "↑ +18%" },
    { label: "Salary Lift", value: "$42K", change: "↑ +8%" },
    { label: "Open Roles", value: "91", change: "↑ +4%" },
  ],

  views: [
    { label: "Graph", id: "graph" },
    { label: "Timeline", id: "timeline" },
    { label: "Market", id: "market" },
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
    timeline: {
      visualization: CareerTimeline,
    },

    market: {
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