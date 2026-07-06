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
      source: "mock",
      version: 3,
      createdDate: "2026-06-26T00:00:00.000Z",
      parseStatus: "mock",
      currentVersionId: "resume-executive-ai-v3",
      versions: [
        {
          id: "resume-executive-ai-v1",
          label: "Original Upload",
          source: "original",
          createdDate: "2026-06-20T00:00:00.000Z",
          isCurrent: false,
        },
        {
          id: "resume-executive-ai-v2",
          label: "AI Transformation Rewrite",
          source: "ai_optimized",
          createdDate: "2026-06-24T00:00:00.000Z",
          isCurrent: false,
        },
        {
          id: "resume-executive-ai-v3",
          label: "Current Executive Version",
          source: "manual_edit",
          createdDate: "2026-06-26T00:00:00.000Z",
          isCurrent: true,
        },
      ],
    },
    {
      id: "resume-finance-leadership",
      name: "Finance Leadership Resume",
      targetGoalId: "goal-digital-transformation",
      targetJobTitle: "VP Digital Transformation",
      status: "draft",
      source: "mock",
      version: 1,
      createdDate: "2026-06-26T00:00:00.000Z",
      parseStatus: "mock",
      currentVersionId: "resume-finance-leadership-v1",
      versions: [
        {
          id: "resume-finance-leadership-v1",
          label: "Finance Leadership Draft",
          source: "original",
          createdDate: "2026-06-26T00:00:00.000Z",
          isCurrent: true,
        },
      ],
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