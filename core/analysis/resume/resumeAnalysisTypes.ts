export type ResumeAnalysisDimension = {
  score: number;
  label: string;
};

export type ResumeRoleContext = {
  title: string;
  industry?: string;
  seniority?: string;
};

export type ResumeContextAnalysis = {
  context: "current" | "target";
  role: ResumeRoleContext;

  overallScore: number;
  atsScore: number;
  keywordCoverage: number;
  titleAlignment: number;
  experienceAlignment: number;
  skillsAlignment: number;
  leadershipAlignment: number;
  industryAlignment: number;
  seniorityAlignment: number;
  achievementStrength: number;
  formattingScore: number;
  completenessScore: number;

  detectedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  gaps: string[];
  recommendations: string[];
};

export type ResumeAnalysisResult = {
  resumeId?: string;
  versionId?: string;
  hasResume: boolean;
  hasTarget: boolean;

  resumeQualityScore: number;
  parserConfidence: number;
  issueCount: number;

  current: ResumeContextAnalysis;
  target: ResumeContextAnalysis;

  comparison: {
    scoreDifference: number;
    atsDifference: number;
    keywordDifference: number;
    strongerContext: "current" | "target" | "equal";
  };
};
