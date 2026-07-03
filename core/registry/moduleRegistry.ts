import {
  CareerGraph,
  CareerStrengths,
  CareerSuggestions,
  CareerWords,
} from "@/modules/career";

export const moduleRegistry = {
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
};

export type ModuleKey = keyof typeof moduleRegistry;