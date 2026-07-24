import type { GoalType, UserGoal, UserProfile } from "@/core/user/userTypes";
import {
  getActiveResume,
  getActiveResumeVersion,
} from "@/modules/resume/lib/resumeIntelligence";

export type CareerOption = {
  id: string;
  label: string;
  match: number;
  evidence: string[];
  nextTitles: string[];
  keywords: string[];
};

type CareerProfile = {
  id: string;
  label: string;
  keywords: string[];
  nextTitles: string[];
  goalTypes?: GoalType[];
};

export type CareerChoice = {
  id: string;
  label: string;
  keywords: string[];
  nextTitles: string[];
};

const careerProfiles: CareerProfile[] = [
  {
    id: "transformation-leadership",
    label: "Digital Transformation Leadership",
    goalTypes: ["employment", "portfolio"],
    keywords: [
      "transformation",
      "automation",
      "change",
      "strategy",
      "enterprise",
      "program",
      "operations",
      "process",
    ],
    nextTitles: [
      "Director Digital Transformation",
      "Director Enterprise Transformation",
      "VP Digital Transformation",
      "Chief Transformation Officer",
    ],
  },
  {
    id: "ai-technology-leadership",
    label: "AI and Technology Leadership",
    goalTypes: ["employment", "education", "portfolio"],
    keywords: [
      "ai",
      "artificial intelligence",
      "automation",
      "data",
      "analytics",
      "architecture",
      "platform",
      "governance",
    ],
    nextTitles: [
      "Director AI Transformation",
      "Director AI Strategy",
      "VP AI Enablement",
      "Chief AI Officer",
    ],
  },
  {
    id: "finance-analytics-leadership",
    label: "Finance and Analytics Leadership",
    goalTypes: ["employment", "portfolio"],
    keywords: [
      "finance",
      "financial",
      "budget",
      "forecast",
      "reporting",
      "bi",
      "business intelligence",
      "power bi",
    ],
    nextTitles: [
      "Director Finance Transformation",
      "Director Business Intelligence",
      "VP Finance Operations",
      "Chief Financial Transformation Officer",
    ],
  },
  {
    id: "operations-leadership",
    label: "Operations Leadership",
    goalTypes: ["employment", "business", "portfolio"],
    keywords: [
      "operations",
      "service",
      "delivery",
      "customer",
      "telemarketing",
      "call center",
      "workflow",
      "performance",
    ],
    nextTitles: [
      "Director Operations",
      "Director Business Operations",
      "VP Operations",
      "Chief Operating Officer",
    ],
  },
  {
    id: "healthcare-operations",
    label: "Healthcare Operations Leadership",
    goalTypes: ["employment", "education"],
    keywords: [
      "healthcare",
      "patient",
      "clinical",
      "provider",
      "payer",
      "claims",
      "compliance",
      "health",
    ],
    nextTitles: [
      "Director Healthcare Transformation",
      "Director Healthcare Operations",
      "VP Healthcare Transformation",
      "Chief Healthcare Transformation Officer",
    ],
  },
  {
    id: "data-analytics-leadership",
    label: "Data and Analytics Leadership",
    goalTypes: ["employment", "education", "portfolio"],
    keywords: [
      "data",
      "analytics",
      "business intelligence",
      "reporting",
      "dashboard",
      "insight",
      "governance",
      "strategy",
    ],
    nextTitles: [
      "Director Data and Analytics",
      "Director Business Intelligence",
      "VP Data Strategy",
      "Chief Data Officer",
    ],
  },
  {
    id: "program-management-leadership",
    label: "Enterprise Program Leadership",
    goalTypes: ["employment", "portfolio"],
    keywords: [
      "program",
      "portfolio",
      "project",
      "delivery",
      "transformation",
      "stakeholder",
      "governance",
      "change",
    ],
    nextTitles: [
      "Director Program Management",
      "Director Transformation Office",
      "VP Enterprise Programs",
      "Chief Program Officer",
    ],
  },
  {
    id: "strategy-advisory-leadership",
    label: "Strategy and Advisory Leadership",
    goalTypes: ["employment", "business", "portfolio"],
    keywords: [
      "strategy",
      "advisory",
      "consulting",
      "market",
      "growth",
      "executive",
      "analysis",
      "transformation",
    ],
    nextTitles: [
      "Director Corporate Strategy",
      "Director Strategic Advisory",
      "VP Strategy",
      "Chief Strategy Officer",
    ],
  },
  {
    id: "risk-governance-leadership",
    label: "Risk and Governance Leadership",
    goalTypes: ["employment"],
    keywords: [
      "risk",
      "governance",
      "compliance",
      "control",
      "audit",
      "policy",
      "regulatory",
      "enterprise",
    ],
    nextTitles: [
      "Director Enterprise Risk",
      "Director Governance and Controls",
      "VP Risk Management",
      "Chief Risk Officer",
    ],
  },
  {
    id: "consulting-business-leadership",
    label: "Consulting and Business Leadership",
    goalTypes: ["employment", "business", "portfolio"],
    keywords: [
      "consulting",
      "client",
      "business development",
      "advisory",
      "delivery",
      "strategy",
      "operations",
      "growth",
    ],
    nextTitles: [
      "Principal Consultant",
      "Managing Director Consulting",
      "VP Client Advisory",
      "Consulting Practice Leader",
    ],
  },
  {
    id: "business-builder",
    label: "Build and Launch a Business",
    goalTypes: ["business", "portfolio", "custom"],
    keywords: [
      "business",
      "company",
      "founder",
      "launch",
      "product",
      "service",
      "customer",
      "revenue",
    ],
    nextTitles: [
      "Validate the customer problem",
      "Test a paid offer",
      "Launch a minimum viable business",
      "Build repeatable revenue",
    ],
  },
  {
    id: "creator-audience",
    label: "Build a Creative Audience and Income",
    goalTypes: ["creative", "business", "portfolio", "lifestyle"],
    keywords: [
      "creator",
      "content",
      "actor",
      "writer",
      "blogger",
      "travel",
      "audience",
      "creative",
    ],
    nextTitles: [
      "Define the audience and format",
      "Publish a consistent body of work",
      "Validate an income channel",
      "Build a sustainable creator system",
    ],
  },
  {
    id: "education-credential",
    label: "Earn a Degree or Professional Credential",
    goalTypes: ["education", "employment"],
    keywords: [
      "degree",
      "school",
      "college",
      "university",
      "certification",
      "license",
      "doctor",
      "education",
    ],
    nextTitles: [
      "Confirm entry requirements",
      "Complete prerequisites",
      "Earn the required credential",
      "Transition into supervised practice",
    ],
  },
  {
    id: "flexible-work-design",
    label: "Design Flexible Work Around Life",
    goalTypes: ["lifestyle", "caregiving", "retirement", "portfolio"],
    keywords: [
      "remote",
      "home",
      "parent",
      "caregiver",
      "flexible",
      "retire",
      "travel",
      "part-time",
    ],
    nextTitles: [
      "Define time and income boundaries",
      "Choose a compatible work model",
      "Run a low-risk transition test",
      "Stabilize the new routine",
    ],
  },
  {
    id: "portfolio-career",
    label: "Build a Portfolio of Income Streams",
    goalTypes: ["portfolio", "business", "creative", "retirement"],
    keywords: [
      "multiple",
      "portfolio",
      "income",
      "businesses",
      "consulting",
      "freelance",
      "side",
      "diversify",
    ],
    nextTitles: [
      "Choose complementary income streams",
      "Validate the first stream",
      "Add a second repeatable stream",
      "Balance risk, time, and return",
    ],
  },
];

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function countMatches(text: string, keywords: string[]) {
  const normalizedText = normalize(text);

  return keywords.reduce((count, keyword) => {
    return normalizedText.includes(normalize(keyword)) ? count + 1 : count;
  }, 0);
}

function getResumeSignals(user: UserProfile, activeResumeId: string) {
  const activeResume = getActiveResume(user, activeResumeId);
  const activeVersion = getActiveResumeVersion(activeResume);
  const parsedDocument = activeVersion?.parsedDocument;
  const structuredResume = parsedDocument?.structuredResume;
  const experienceTitles =
    structuredResume?.experience.map((item) => item.title).filter(Boolean) ??
    [];
  const skills = structuredResume?.skills ?? [];
  const rawText = parsedDocument?.rawText ?? "";

  return {
    activeResume,
    activeVersion,
    parsedDocument,
    structuredResume,
    experienceTitles,
    skills,
    rawText,
    signalText: unique([...experienceTitles, ...skills, rawText ? rawText : ""])
      .join(" ")
      .toLowerCase(),
  };
}

function scoreCareer(profile: CareerProfile, signalText: string) {
  const matches = countMatches(signalText, profile.keywords);
  const match = Math.min(96, Math.max(42, 48 + matches * 8));

  return {
    ...profile,
    match,
    evidence: profile.keywords
      .filter((keyword) => signalText.includes(normalize(keyword)))
      .slice(0, 4),
  };
}

function getCompletedGoal(user: UserProfile) {
  return user.goals.find((goal) => Boolean(goal.setupCompletedAt));
}

function getGoalSignalText(goal: UserGoal) {
  return unique([
    goal.title,
    goal.statement,
    goal.motivation,
    goal.industry ?? "",
    goal.seniority ?? "",
    goal.workPreference ?? "",
    ...goal.constraints,
    ...goal.successCriteria.map((criterion) => criterion.label),
  ])
    .join(" ")
    .toLowerCase();
}

function scoreGoalPath(profile: CareerProfile, goal: UserGoal) {
  const signalText = getGoalSignalText(goal);
  const keywordMatches = countMatches(signalText, profile.keywords);
  const typeMatch = goal.goalTypes.some((type) =>
    profile.goalTypes?.includes(type)
  );
  const evidence = profile.keywords
    .filter((keyword) => signalText.includes(normalize(keyword)))
    .slice(0, 4);

  return {
    ...profile,
    match: Math.min(96, 44 + (typeMatch ? 20 : 0) + keywordMatches * 8),
    evidence,
  };
}

export function getSelectedCareerChoices(user: UserProfile): CareerChoice[] {
  if (!user.careerPreference?.selectionConfirmedAt) {
    return [];
  }

  const selectedIds =
    user.careerPreference?.selectedCareerIds?.length
      ? user.careerPreference.selectedCareerIds
      : user.careerPreference?.selectedCareerId
        ? [user.careerPreference.selectedCareerId]
        : [];

  return selectedIds.flatMap((id) => {
    const profile = careerProfiles.find((item) => item.id === id);
    return profile ? [profile] : [];
  });
}

export function getCareerIntelligence(
  user: UserProfile,
  activeResumeId: string
) {
  const signals = getResumeSignals(user, activeResumeId);
  const hasResume = Boolean(signals.activeResume);
  const completedGoal = getCompletedGoal(user);
  const hasCompletedGoal = Boolean(completedGoal);

  if (!completedGoal) {
    const selectedCareers = getSelectedCareerChoices(user).map((career) => ({
      ...career,
      match: 0,
      evidence: [] as string[],
    }));

    return {
      hasResume,
      hasCompletedGoal,
      completedGoal,
      currentCareer: undefined,
      selectedCareer: selectedCareers[0],
      selectedCareers,
      careerOptions: [] as CareerOption[],
      nextTitles: selectedCareers[0]?.nextTitles ?? [],
      inferredTitle: "",
      skills: [] as string[],
      experienceTitles: [] as string[],
    };
  }

  const careerOptions = careerProfiles
    .map((profile) => {
      const goalPath = scoreGoalPath(profile, completedGoal);

      if (!hasResume) return goalPath;

      const resumePath = scoreCareer(profile, signals.signalText);
      return {
        ...goalPath,
        match: Math.round(goalPath.match * 0.7 + resumePath.match * 0.3),
        evidence: unique([...goalPath.evidence, ...resumePath.evidence]).slice(0, 4),
      };
    })
    .sort((first, second) => second.match - first.match);
  const currentCareer = hasResume
    ? careerProfiles
        .map((profile) => scoreCareer(profile, signals.signalText))
        .sort((first, second) => second.match - first.match)[0]
    : undefined;
  const selectedIds =
    user.careerPreference?.selectionConfirmedAt &&
    user.careerPreference?.selectedCareerIds?.length
      ? user.careerPreference.selectedCareerIds
      : user.careerPreference?.selectionConfirmedAt &&
          user.careerPreference?.selectedCareerId
        ? [user.careerPreference.selectedCareerId]
        : [];
  const selectedCareers = selectedIds.flatMap((id) => {
    const career = careerOptions.find((option) => option.id === id);
    return career ? [career] : [];
  });
  const selectedCareer = selectedCareers[0] ?? careerOptions[0];

  return {
    hasResume,
    hasCompletedGoal,
    completedGoal,
    currentCareer,
    selectedCareer,
    selectedCareers,
    careerOptions,
    nextTitles: selectedCareer?.nextTitles ?? [],
    inferredTitle: signals.experienceTitles[0] ?? "",
    skills: signals.skills,
    experienceTitles: signals.experienceTitles,
  };
}
