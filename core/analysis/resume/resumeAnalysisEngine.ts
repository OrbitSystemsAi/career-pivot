import type { StructuredResume } from "@/core/resumeParsing/resumeStructureTypes";
import type {
  UserGoal,
  UserProfile,
  UserResume,
} from "@/core/user/userTypes";
import type {
  ResumeAnalysisResult,
  ResumeContextAnalysis,
  ResumeRoleContext,
} from "./resumeAnalysisTypes";

const GENERAL_EXECUTIVE_KEYWORDS = [
  "leadership",
  "strategy",
  "transformation",
  "executive reporting",
  "stakeholder",
  "operations",
  "financial planning",
  "business intelligence",
  "analytics",
  "automation",
  "data governance",
  "process improvement",
];

const TARGET_TRANSFORMATION_KEYWORDS = [
  "ai governance",
  "enterprise architecture",
  "change management",
  "healthcare operations",
  "digital transformation",
  "data strategy",
  "executive reporting",
  "automation",
  "business intelligence",
  "finance leadership",
];

const SENIORITY_WORDS = [
  "chief",
  "executive",
  "vice president",
  "vp",
  "head",
  "director",
  "manager",
  "senior",
  "lead",
];

const LEADERSHIP_WORDS = [
  "led",
  "lead",
  "leader",
  "managed",
  "directed",
  "owned",
  "oversaw",
  "partnered",
  "executive",
  "stakeholder",
  "strategy",
  "transformation",
];

const ACHIEVEMENT_PATTERNS = [
  /\$\s?\d+/i,
  /\d+\s?%/i,
  /\d+\+?/i,
  /\b(increased|reduced|improved|saved|delivered|grew|generated|automated)\b/i,
];

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function unique(values: string[]) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean))
  );
}

function tokenize(value: string) {
  return unique(
    normalize(value)
      .split(/[^a-z0-9+#&]+/)
      .filter((token) => token.length >= 3)
  );
}

function includesPhrase(text: string, phrase: string) {
  return normalize(text).includes(normalize(phrase));
}

function getActiveResume(user: UserProfile, activeResumeId: string) {
  return (
    user.resumes.find((resume) => resume.id === activeResumeId) ??
    user.resumes[0]
  );
}

function getActiveVersion(activeResume: UserResume | undefined) {
  return (
    activeResume?.versions.find(
      (version) => version.id === activeResume.currentVersionId
    ) ?? activeResume?.versions[0]
  );
}

function getResumeText(
  structuredResume: StructuredResume | undefined,
  rawText: string
) {
  const structuredText = structuredResume
    ? [
        structuredResume.name,
        structuredResume.summary,
        structuredResume.skills.join(" "),
        structuredResume.experience
          .flatMap((experience) => [
            experience.title,
            experience.company,
            experience.startDate,
            experience.endDate,
            ...experience.bullets,
            ...experience.rawLines,
          ])
          .join(" "),
        structuredResume.education.join(" "),
        structuredResume.certifications.join(" "),
        structuredResume.unknownSections
          .flatMap((section) => [section.title, ...section.lines])
          .join(" "),
        structuredResume.unclassifiedLines.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  return `${rawText} ${structuredText}`.trim();
}

function getRoleKeywords(
  role: ResumeRoleContext,
  context: "current" | "target"
) {
  const roleTokens = tokenize(
    `${role.title} ${role.industry ?? ""} ${role.seniority ?? ""}`
  );

  const foundation =
    context === "target"
      ? TARGET_TRANSFORMATION_KEYWORDS
      : GENERAL_EXECUTIVE_KEYWORDS;

  return unique([...foundation, ...roleTokens]);
}

function getDetectedKeywords(text: string, keywords: string[]) {
  return keywords.filter((keyword) => includesPhrase(text, keyword));
}

function scoreKeywordCoverage(detected: string[], required: string[]) {
  if (required.length === 0) {
    return 0;
  }

  return clampScore((detected.length / required.length) * 100);
}

function scoreTitleAlignment(text: string, title: string) {
  const titleTokens = tokenize(title);

  if (titleTokens.length === 0) {
    return 50;
  }

  const detectedCount = titleTokens.filter((token) =>
    includesPhrase(text, token)
  ).length;

  return clampScore(45 + (detectedCount / titleTokens.length) * 55);
}

function scoreSkillsAlignment(
  skills: string[],
  requiredKeywords: string[],
  text: string
) {
  const normalizedSkills = skills.map(normalize);

  const matched = requiredKeywords.filter((keyword) => {
    const normalizedKeyword = normalize(keyword);

    return (
      includesPhrase(text, keyword) ||
      normalizedSkills.some(
        (skill) =>
          skill.includes(normalizedKeyword) ||
          normalizedKeyword.includes(skill)
      )
    );
  });

  if (requiredKeywords.length === 0) {
    return 0;
  }

  return clampScore(35 + (matched.length / requiredKeywords.length) * 65);
}

function scoreExperienceAlignment(
  structuredResume: StructuredResume | undefined,
  text: string,
  role: ResumeRoleContext
) {
  const experienceCount = structuredResume?.experience.length ?? 0;
  const titleTokens = tokenize(role.title);
  const matchedTitleTokens = titleTokens.filter((token) =>
    includesPhrase(text, token)
  ).length;

  const experienceBase = Math.min(55, experienceCount * 12);
  const roleEvidence =
    titleTokens.length > 0
      ? (matchedTitleTokens / titleTokens.length) * 35
      : 0;

  return clampScore(20 + experienceBase + roleEvidence);
}

function scoreLeadership(text: string) {
  const matches = LEADERSHIP_WORDS.filter((keyword) =>
    includesPhrase(text, keyword)
  ).length;

  return clampScore(40 + matches * 6);
}

function scoreIndustry(text: string, industry?: string) {
  if (!industry) {
    return 60;
  }

  const industryTokens = tokenize(industry);

  if (industryTokens.length === 0) {
    return 60;
  }

  const matches = industryTokens.filter((token) =>
    includesPhrase(text, token)
  ).length;

  return clampScore(45 + (matches / industryTokens.length) * 55);
}

function scoreSeniority(text: string, role: ResumeRoleContext) {
  const roleSeniorityWords = SENIORITY_WORDS.filter((word) =>
    includesPhrase(role.title, word)
  );

  const resumeSeniorityWords = SENIORITY_WORDS.filter((word) =>
    includesPhrase(text, word)
  );

  if (roleSeniorityWords.length === 0) {
    return resumeSeniorityWords.length > 0 ? 80 : 65;
  }

  const matches = roleSeniorityWords.filter((word) =>
    resumeSeniorityWords.includes(word)
  ).length;

  return clampScore(45 + matches * 30 + resumeSeniorityWords.length * 3);
}

function scoreAchievements(text: string) {
  const matches = ACHIEVEMENT_PATTERNS.reduce(
    (total, pattern) => total + (pattern.test(text) ? 1 : 0),
    0
  );

  return clampScore(35 + matches * 15);
}

function scoreCompleteness(structuredResume?: StructuredResume) {
  if (!structuredResume) {
    return 20;
  }

  const checks = [
    Boolean(structuredResume.name),
    Boolean(structuredResume.contact.email),
    Boolean(structuredResume.contact.phone),
    Boolean(structuredResume.summary),
    structuredResume.skills.length > 0,
    structuredResume.experience.length > 0,
    structuredResume.education.length > 0,
  ];

  const completed = checks.filter(Boolean).length;

  return clampScore((completed / checks.length) * 100);
}

function scoreFormatting(
  rawText: string,
  structuredResume?: StructuredResume
) {
  let score = 55;

  if (rawText.length > 500) {
    score += 10;
  }

  if ((structuredResume?.experience.length ?? 0) > 0) {
    score += 10;
  }

  if ((structuredResume?.skills.length ?? 0) > 0) {
    score += 10;
  }

  if ((structuredResume?.unknownSections.length ?? 0) === 0) {
    score += 10;
  }

  return clampScore(score);
}

function getParserConfidence(structuredResume?: StructuredResume) {
  if (!structuredResume) {
    return 0;
  }

  let score = 35;

  if (structuredResume.name) {
    score += 10;
  }

  if (structuredResume.contact.email) {
    score += 10;
  }

  if (structuredResume.summary) {
    score += 10;
  }

  if (structuredResume.skills.length > 0) {
    score += 15;
  }

  if (structuredResume.experience.length > 0) {
    score += 15;
  }

  if (structuredResume.unclassifiedLines.length > 10) {
    score -= 15;
  }

  return clampScore(score);
}

function buildStrengths(
  scores: Record<string, number>,
  detectedKeywords: string[]
) {
  const strengths: string[] = [];

  if (scores.leadershipAlignment >= 75) {
    strengths.push("Strong leadership and stakeholder language.");
  }

  if (scores.experienceAlignment >= 75) {
    strengths.push("Experience aligns well with the role context.");
  }

  if (scores.skillsAlignment >= 75) {
    strengths.push("Skills provide strong role coverage.");
  }

  if (scores.achievementStrength >= 70) {
    strengths.push("Resume contains measurable achievement evidence.");
  }

  if (detectedKeywords.length >= 6) {
    strengths.push("Strong keyword coverage for this role.");
  }

  return strengths.length > 0
    ? strengths
    : ["Resume contains foundational experience relevant to this role."];
}

function buildGaps(
  scores: Record<string, number>,
  missingKeywords: string[]
) {
  const gaps: string[] = [];

  if (scores.keywordCoverage < 70) {
    gaps.push("Role-specific keyword coverage is incomplete.");
  }

  if (scores.achievementStrength < 65) {
    gaps.push("More quantified outcomes and measurable impact are needed.");
  }

  if (scores.leadershipAlignment < 70) {
    gaps.push("Leadership ownership is not consistently demonstrated.");
  }

  if (scores.industryAlignment < 70) {
    gaps.push("Industry-specific evidence is limited.");
  }

  if (missingKeywords.length > 0) {
    gaps.push(
      `Missing evidence for ${missingKeywords.slice(0, 3).join(", ")}.`
    );
  }

  return gaps;
}

function buildRecommendations(
  scores: Record<string, number>,
  missingKeywords: string[],
  role: ResumeRoleContext
) {
  const recommendations: string[] = [];

  if (scores.titleAlignment < 75) {
    recommendations.push(
      `Strengthen positioning for ${role.title} in the headline and summary.`
    );
  }

  if (scores.keywordCoverage < 75 && missingKeywords.length > 0) {
    recommendations.push(
      `Add supported evidence for ${missingKeywords.slice(0, 3).join(", ")}.`
    );
  }

  if (scores.achievementStrength < 75) {
    recommendations.push(
      "Add measurable outcomes, scale, financial impact, or operational results."
    );
  }

  if (scores.leadershipAlignment < 75) {
    recommendations.push(
      "Clarify ownership, executive influence, and transformation leadership."
    );
  }

  return recommendations;
}

function analyzeContext({
  context,
  role,
  rawText,
  structuredResume,
}: {
  context: "current" | "target";
  role: ResumeRoleContext;
  rawText: string;
  structuredResume?: StructuredResume;
}): ResumeContextAnalysis {
  const requiredKeywords = getRoleKeywords(role, context);
  const detectedKeywords = getDetectedKeywords(rawText, requiredKeywords);
  const missingKeywords = requiredKeywords.filter(
    (keyword) => !detectedKeywords.includes(keyword)
  );

  const keywordCoverage = scoreKeywordCoverage(
    detectedKeywords,
    requiredKeywords
  );
  const titleAlignment = scoreTitleAlignment(rawText, role.title);
  const skillsAlignment = scoreSkillsAlignment(
    structuredResume?.skills ?? [],
    requiredKeywords,
    rawText
  );
  const experienceAlignment = scoreExperienceAlignment(
    structuredResume,
    rawText,
    role
  );
  const leadershipAlignment = scoreLeadership(rawText);
  const industryAlignment = scoreIndustry(rawText, role.industry);
  const seniorityAlignment = scoreSeniority(rawText, role);
  const achievementStrength = scoreAchievements(rawText);
  const completenessScore = scoreCompleteness(structuredResume);
  const formattingScore = scoreFormatting(rawText, structuredResume);

  const atsScore = clampScore(
    keywordCoverage * 0.3 +
      titleAlignment * 0.15 +
      skillsAlignment * 0.15 +
      experienceAlignment * 0.15 +
      leadershipAlignment * 0.1 +
      industryAlignment * 0.1 +
      formattingScore * 0.05
  );

  const overallScore = clampScore(
    atsScore * 0.35 +
      experienceAlignment * 0.2 +
      skillsAlignment * 0.15 +
      leadershipAlignment * 0.1 +
      seniorityAlignment * 0.1 +
      achievementStrength * 0.05 +
      completenessScore * 0.05
  );

  const scores = {
    keywordCoverage,
    titleAlignment,
    skillsAlignment,
    experienceAlignment,
    leadershipAlignment,
    industryAlignment,
    seniorityAlignment,
    achievementStrength,
    completenessScore,
    formattingScore,
  };

  return {
    context,
    role,
    overallScore,
    atsScore,
    keywordCoverage,
    titleAlignment,
    experienceAlignment,
    skillsAlignment,
    leadershipAlignment,
    industryAlignment,
    seniorityAlignment,
    achievementStrength,
    formattingScore,
    completenessScore,
    detectedKeywords,
    missingKeywords,
    strengths: buildStrengths(scores, detectedKeywords),
    gaps: buildGaps(scores, missingKeywords),
    recommendations: buildRecommendations(scores, missingKeywords, role),
  };
}

function buildUnselectedTargetAnalysis(
  role: ResumeRoleContext
): ResumeContextAnalysis {
  return {
    context: "target",
    role,
    overallScore: 0,
    atsScore: 0,
    keywordCoverage: 0,
    titleAlignment: 0,
    experienceAlignment: 0,
    skillsAlignment: 0,
    leadershipAlignment: 0,
    industryAlignment: 0,
    seniorityAlignment: 0,
    achievementStrength: 0,
    formattingScore: 0,
    completenessScore: 0,
    detectedKeywords: [],
    missingKeywords: [],
    strengths: [],
    gaps: [],
    recommendations: [],
  };
}

function getTargetRole(
  _activeResume: UserResume | undefined,
  targetGoal: UserGoal | undefined
): ResumeRoleContext {
  return {
    title: targetGoal?.title ?? "Target role not selected",
    industry: targetGoal?.industry,
    seniority: targetGoal?.seniority,
  };
}

export function analyzeResume(
  user: UserProfile,
  activeResumeId: string
): ResumeAnalysisResult {
  const activeResume = getActiveResume(user, activeResumeId);
  const activeVersion = getActiveVersion(activeResume);
  const parsedDocument = activeVersion?.parsedDocument;
  const structuredResume = parsedDocument?.structuredResume;
  const targetGoal = user.goals.find(
    (goal) => goal.id === activeResume?.targetGoalId
  );

  const hasResume = Boolean(activeResume && parsedDocument);
  const hasTarget = Boolean(targetGoal);

  const currentRole: ResumeRoleContext = {
    title: user.currentTitle || "Current role",
    industry: user.currentIndustry,
  };

  const targetRole = getTargetRole(activeResume, targetGoal);

  const resumeText = getResumeText(
    structuredResume,
    parsedDocument?.rawText ?? ""
  );

  const current = analyzeContext({
    context: "current",
    role: currentRole,
    rawText: resumeText,
    structuredResume,
  });

  const target = hasTarget
    ? analyzeContext({
        context: "target",
        role: targetRole,
        rawText: resumeText,
        structuredResume,
      })
    : buildUnselectedTargetAnalysis(targetRole);

  const resumeQualityScore = clampScore(
    current.completenessScore * 0.3 +
      current.formattingScore * 0.2 +
      current.achievementStrength * 0.2 +
      current.leadershipAlignment * 0.15 +
      Math.max(current.skillsAlignment, target.skillsAlignment) * 0.15
  );

  const issueCount = unique(
    hasTarget
      ? [...current.gaps, ...target.gaps, ...target.missingKeywords]
      : current.gaps
  ).length;

  const scoreDifference = hasTarget
    ? target.overallScore - current.overallScore
    : 0;

  return {
    resumeId: activeResume?.id,
    versionId: activeVersion?.id,
    hasResume,
    hasTarget,
    resumeQualityScore,
    parserConfidence: getParserConfidence(structuredResume),
    issueCount,
    current,
    target,
    comparison: {
      scoreDifference,
      atsDifference: hasTarget ? target.atsScore - current.atsScore : 0,
      keywordDifference: hasTarget
        ? target.keywordCoverage - current.keywordCoverage
        : 0,
      strongerContext:
        !hasTarget
          ? "equal"
          : scoreDifference > 0
            ? "target"
            : scoreDifference < 0
              ? "current"
              : "equal",
    },
  };
}
