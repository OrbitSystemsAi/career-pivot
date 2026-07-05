export type UserGoal = {
  id: string;
  title: string;
  industry: string;
  seniority: string;
  workPreference: "remote" | "hybrid" | "onsite" | "flexible";
};

export type UserResume = {
  id: string;
  name: string;
  targetGoalId: string;
  targetJobTitle?: string;
  status: "draft" | "active" | "archived";
};

export type ReviewerProfile = {
  isReviewer: boolean;
  reviewIndustries: string[];
  reviewSeniority: string[];
  creditsEarned: number;
  creditsAvailable: number;
};

export type UserProfile = {
  id: string;
  name: string;
  location: string;
  currentTitle: string;
  currentIndustry: string;
  targetIndustries: string[];
  skills: string[];
  goals: UserGoal[];
  resumes: UserResume[];
  reviewerProfile: ReviewerProfile;
};