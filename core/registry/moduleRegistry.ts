import {
  CareerGraph,
  CareerStrengths,
  CareerSuggestions,
  CareerWords,
} from "@/modules/career";

import { ResumeModule } from "@/modules/resume";
import { NetworkModule } from "@/modules/network";

export const moduleRegistry = {
  resume: {
    id: "resume",
    name: "Resume",
    panels: {
      visualization: ResumeModule,
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
      bottomLeft: NetworkModule,
      bottomCenter: NetworkModule,
      bottomRight: NetworkModule,
    },
  },
};

export type ModuleKey = keyof typeof moduleRegistry;