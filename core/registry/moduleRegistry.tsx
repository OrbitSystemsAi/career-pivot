import CareerGraph from "@/modules/career/components/CareerGraph";
import CareerStrengths from "@/modules/career/components/CareerStrengths";
import CareerSuggestions from "@/modules/career/components/CareerSuggestions";
import CareerWords from "@/modules/career/components/CareerWords";

export const moduleRegistry = {
  career: {
    id: "career",
    label: "Career",
    panels: {
      Visualization: CareerGraph,
      BottomLeft: CareerStrengths,
      BottomCenter: CareerSuggestions,
      BottomRight: CareerWords,
    },
  },
};

export type ModuleKey = keyof typeof moduleRegistry;