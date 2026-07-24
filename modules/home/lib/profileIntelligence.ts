import type { UserProfile } from "@/core/user/userTypes";
import { getResumeIntelligence } from "@/modules/resume/lib/resumeIntelligence";

const industrySignals: Array<[RegExp, string]> = [
  [/health|clinical|patient|hospital/i, "Healthcare"],
  [/finance|financial|accounting|treasury|bank/i, "Finance"],
  [/technology|software|data|digital|information systems|ai\b/i, "Technology"],
  [/retail|consumer|merchandising/i, "Retail"],
  [/manufactur|supply chain|industrial/i, "Manufacturing"],
  [/government|public sector|municipal/i, "Public Sector"],
  [/education|university|academic/i, "Education"],
];

function inferIndustry(text: string) {
  return industrySignals.find(([pattern]) => pattern.test(text))?.[1];
}

function getYear(value?: string) {
  const year = value?.match(/\b(19|20)\d{2}\b/)?.[0];
  return year ? Number(year) : undefined;
}

function estimateYearsExperience(
  experience: Array<{ startDate?: string; rawLines: string[] }>
) {
  const years = experience.flatMap((item) =>
    [getYear(item.startDate), ...item.rawLines.map(getYear)].filter(
      (year): year is number => Boolean(year)
    )
  );
  if (years.length === 0) return undefined;
  const earliest = Math.min(...years);
  const estimate = new Date().getFullYear() - earliest;
  return estimate >= 0 && estimate <= 70 ? estimate : undefined;
}

function getResumeHighlights(
  experience: Array<{ bullets: string[] }>,
) {
  const actionPattern = /\b(?:achieved|accelerated|built|created|delivered|designed|developed|drove|enabled|established|expanded|generated|grew|improved|increased|launched|led|managed|modernized|optimized|reduced|scaled|saved|spearheaded|streamlined|transformed)\b/i;
  const evidencePattern = /(?:[$%]|\b\d+(?:[.,]\d+)?(?:\+|[KMB])?\b)/i;

  return experience
    .flatMap((role) => role.bullets)
    .map((bullet, index) => ({
      bullet: bullet.replace(/^[•\-–—]\s*/, "").trim(),
      index,
    }))
    .filter(({ bullet }) => bullet.length >= 24 && bullet.length <= 320)
    .filter(
      ({ bullet }, index, values) =>
        values.findIndex(
          (candidate) => candidate.bullet.toLowerCase() === bullet.toLowerCase(),
        ) === index,
    )
    .map((item) => ({
      ...item,
      score:
        (evidencePattern.test(item.bullet) ? 3 : 0) +
        (actionPattern.test(item.bullet) ? 2 : 0) +
        (item.bullet.length <= 180 ? 1 : 0),
    }))
    .toSorted((first, second) => second.score - first.score || first.index - second.index)
    .slice(0, 10)
    .map(({ bullet }) => bullet);
}

export function getProfileIntelligence(
  user: UserProfile,
  activeResumeId: string
) {
  const { hasResume, structuredResume } = getResumeIntelligence(
    user,
    activeResumeId
  );
  const currentRole = structuredResume?.experience[0];
  const resumeText = [
    structuredResume?.summary,
    currentRole?.title,
    currentRole?.company,
  ]
    .filter(Boolean)
    .join(" ");

  const resumeValues = {
    currentTitle:
      currentRole?.title && currentRole.title !== "Role"
        ? currentRole.title
        : undefined,
    currentIndustry: inferIndustry(resumeText),
    headline: structuredResume?.summary || undefined,
    skills: structuredResume?.skills ?? [],
    highlights: structuredResume
      ? getResumeHighlights(structuredResume.experience)
      : [],
    yearsExperience: structuredResume
      ? estimateYearsExperience(structuredResume.experience)
      : undefined,
  };

  return {
    hasResume,
    resumeValues,
    effective: {
      currentTitle: user.currentTitle || resumeValues.currentTitle || "",
      currentIndustry:
        user.currentIndustry || resumeValues.currentIndustry || "",
      headline: user.headline || resumeValues.headline || "",
      skills:
        user.skills.length > 0 ? user.skills : resumeValues.skills,
      highlights:
        user.highlights.length > 0 ? user.highlights : resumeValues.highlights,
      yearsExperience:
        user.yearsExperience ?? resumeValues.yearsExperience,
    },
    sources: {
      currentTitle: !user.currentTitle && Boolean(resumeValues.currentTitle),
      currentIndustry:
        !user.currentIndustry && Boolean(resumeValues.currentIndustry),
      headline: !user.headline && Boolean(resumeValues.headline),
      skills:
        user.skills.length === 0 && resumeValues.skills.length > 0,
      highlights:
        user.highlights.length === 0 && resumeValues.highlights.length > 0,
      yearsExperience:
        user.yearsExperience === undefined &&
        resumeValues.yearsExperience !== undefined,
    },
  };
}
