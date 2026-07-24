import type { ModuleDefinition } from "@/core/types/module";
import {
  OpportunityActionPanel,
  OpportunityCountPanel,
  OpportunityGoalPanel,
  OpportunitySafetyPanel,
  OpportunityShortlistPanel,
  OpportunitySourcePanel,
  OpportunityWorkspace,
} from "@/modules/opportunity";

export const opportunityModule: ModuleDefinition = {
  id: "opportunity",
  name: "Opportunity",
  description: "Goal-Aware Opportunities",
  icon: "◎",
  metrics: [
    { label: "Matched Paths", value: "Goal-aware" },
    { label: "Saved", value: "0" },
    { label: "Live Sources", value: "0" },
    { label: "Verification", value: "Required" },
  ],
  views: [{ label: "Discover", id: "discover" }],
  panels: {
    visualization: OpportunityWorkspace,
    utilityTop: OpportunityGoalPanel,
    utilityMiddle: OpportunityShortlistPanel,
    utilityBottom: OpportunitySourcePanel,
    bottomLeft: OpportunityCountPanel,
    bottomCenter: OpportunityActionPanel,
    bottomRight: OpportunitySafetyPanel,
  },
};
