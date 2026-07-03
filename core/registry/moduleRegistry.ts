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