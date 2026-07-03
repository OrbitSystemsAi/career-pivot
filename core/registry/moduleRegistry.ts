import {
  CareerGraph,
  CareerStrengths,
  CareerSuggestions,
  CareerWords,
  CareerFilters,
  CareerCompanies,
} from "@/modules/career";

import D4UtilityMiddlePanel from "@/core/shell/panels/D4UtilityMiddlePanel";

import {
  ResumeModule,
  ResumeFilters,
  ResumeContext,
  ResumeResults,
} from "@/modules/resume";

import {
  NetworkModule,
  NetworkFilters,
  NetworkContext,
  NetworkResults,
} from "@/modules/network";

export const moduleRegistry = {
  resume: {
    id: "resume",
    name: "Resume",
    description: "Resume Intelligence",
    icon: "📄",

    panels: {
      visualization: ResumeModule,

      utilityTop: ResumeFilters,
      utilityMiddle: ResumeContext,
      utilityBottom: ResumeResults,

      bottomLeft: ResumeModule,
      bottomCenter: ResumeModule,
      bottomRight: ResumeModule,
    },
  },

  career: {
    id: "career",
    name: "Career",
    description: "Career Intelligence",
    icon: "🚀",

    panels: {
      visualization: CareerGraph,

      utilityTop: CareerFilters,
      utilityMiddle: D4UtilityMiddlePanel,
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

    panels: {
      visualization: NetworkModule,

      utilityTop: NetworkFilters,
      utilityMiddle: NetworkContext,
      utilityBottom: NetworkResults,

      bottomLeft: NetworkModule,
      bottomCenter: NetworkModule,
      bottomRight: NetworkModule,
    },
  },
};

export type ModuleKey = keyof typeof moduleRegistry;