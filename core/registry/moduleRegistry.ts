import type { ModuleDefinition } from "@/core/types/module";

import {
  CareerGraph,
  CareerStrengths,
  CareerSuggestions,
  CareerWords,
  CareerFilters,
  CareerPath,
  CareerCompanies,
} from "@/modules/career";

import {
  ResumeModule,
  ResumeFilters,
  ResumeContext,
  ResumeResults,
  ResumeStrengths,
  ResumeGaps,
  ResumeActions,
} from "@/modules/resume";

import {
  NetworkModule,
  NetworkFilters,
  NetworkContext,
  NetworkResults,
  NetworkConnections,
  NetworkGaps,
  NetworkActions,
} from "@/modules/network";

export const moduleRegistry = {
  resume: {
    id: "resume",
    name: "Resume",
    description: "Resume Intelligence",
    icon: "📄",

    metrics: [
      { label: "Resume Score", value: "84%", change: "↑ +12%" },
      { label: "ATS Match", value: "76%", change: "↑ +9%" },
      { label: "Keywords", value: "48", change: "↑ +5" },
      { label: "Gaps", value: "7", change: "↓ -3" },
    ],

    panels: {
      visualization: ResumeModule,
      utilityTop: ResumeFilters,
      utilityMiddle: ResumeContext,
      utilityBottom: ResumeResults,
      bottomLeft: ResumeStrengths,
      bottomCenter: ResumeGaps,
      bottomRight: ResumeActions,
    },
  },

  career: {
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

    panels: {
      visualization: CareerGraph,
      utilityTop: CareerFilters,
      utilityMiddle: CareerPath,
      utilityBottom: CareerCompanies,
      bottomLeft: CareerStrengths,
      bottomCenter: CareerSuggestions,
      bottomRight: CareerWords,
    },
  },

  network: {
    id: "network",
    name: "Network",
    description: "Network Intelligence",
    icon: "🌐",

    metrics: [
      { label: "Network Score", value: "68%", change: "↑ +21%" },
      { label: "Warm Paths", value: "14", change: "↑ +6" },
      { label: "Recruiters", value: "37", change: "↑ +8" },
      { label: "Target Companies", value: "22", change: "↑ +5" },
    ],

    panels: {
      visualization: NetworkModule,
      utilityTop: NetworkFilters,
      utilityMiddle: NetworkContext,
      utilityBottom: NetworkResults,
      bottomLeft: NetworkConnections,
      bottomCenter: NetworkGaps,
      bottomRight: NetworkActions,
    },
  },
} satisfies Record<string, ModuleDefinition>;

export type ModuleKey = keyof typeof moduleRegistry;