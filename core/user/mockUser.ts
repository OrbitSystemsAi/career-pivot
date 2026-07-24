import type { UserProfile } from "./userTypes";

export const mockUser: UserProfile = {
  id: "user-earl-demo",
  name: "Earl Powery",
  headline: "",
  highlights: [],
  location: "Weston, FL",
  currentTitle: "",
  currentIndustry: "",
  targetIndustries: [],

  skills: [],

  goals: [],

  resumes: [],

  careerPreference: {},

  planningProgress: {
    taskStatuses: {},
    submittedEvidence: [],
    agentArtifacts: [],
  },

  opportunityProgress: {
    savedOpportunityIds: [],
    dismissedOpportunityIds: [],
  },

  network: {
    connectedSources: [],
    connections: [],
  },

  agentWorkforce: {
    recruitedAgents: [],
    taskRuns: [],
  },

  reviewerProfile: {
    isReviewer: true,
    reviewIndustries: ["Finance", "Healthcare", "Digital Transformation"],
    reviewSeniority: ["Manager", "Director", "VP"],
    creditsEarned: 12,
    creditsAvailable: 8,
  },
};
