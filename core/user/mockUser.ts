import type { UserProfile } from "./userTypes";

export const mockUser: UserProfile = {
  id: "user-earl-demo",
  name: "Earl Powery",
  location: "Weston, FL",
  currentTitle: "Senior Leader",
  currentIndustry: "Telemarketing",
  targetIndustries: ["Healthcare", "AI", "Digital Transformation"],

  skills: [
    "Finance leadership",
    "Business intelligence",
    "Executive reporting",
    "Digital transformation",
    "Automation strategy",
    "Power BI",
    "Data governance",
  ],

  goals: [
    {
      id: "goal-healthcare-ai",
      title: "Director AI Transformation",
      industry: "Healthcare",
      seniority: "Director+",
      workPreference: "remote",
    },
    {
      id: "goal-digital-transformation",
      title: "VP Digital Transformation",
      industry: "Technology",
      seniority: "VP",
      workPreference: "remote",
    },
  ],

  resumes: [
    {
      id: "resume-executive-ai",
      name: "Executive AI Transformation Resume",
      targetGoalId: "goal-healthcare-ai",
      targetJobTitle: "Director AI Transformation",
      status: "active",
    },
    {
      id: "resume-finance-leadership",
      name: "Finance Leadership Resume",
      targetGoalId: "goal-digital-transformation",
      targetJobTitle: "VP Digital Transformation",
      status: "draft",
    },
  ],

  reviewerProfile: {
    isReviewer: true,
    reviewIndustries: ["Finance", "Healthcare", "Digital Transformation"],
    reviewSeniority: ["Manager", "Director", "VP"],
    creditsEarned: 12,
    creditsAvailable: 8,
  },
};