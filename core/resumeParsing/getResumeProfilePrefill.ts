import type { ParsedResumeDocument } from "./parsedResumeTypes";
import { cleanProfileName } from "@/core/user/cleanProfileName";

export type ResumeProfilePrefill = {
  name?: string;
  location?: string;
  currentTitle?: string;
  currentIndustry?: string;
  headline?: string;
  skills: string[];
  yearsExperience?: number;
};

function inferIndustry(text: string) {
  const normalized = text.toLowerCase();
  const signals: Array<[string, RegExp]> = [
    ["Finance", /\b(finance|financial|banking|accounting|treasury|investment)\b/],
    ["Healthcare", /\b(healthcare|health care|hospital|clinical|medical)\b/],
    ["Technology", /\b(technology|software|digital|data|information technology|it)\b/],
    ["Operations", /\b(operations|supply chain|logistics|procurement)\b/],
    ["Marketing", /\b(marketing|advertising|brand|communications)\b/],
    ["Education", /\b(education|academic|university|college|school)\b/],
    ["Construction", /\b(construction|building|contractor|engineering)\b/],
    ["Government", /\b(government|public sector|municipal|federal|state agency)\b/],
  ];

  return signals.find(([, pattern]) => pattern.test(normalized))?.[0];
}

function estimateYearsExperience(parsedDocument: ParsedResumeDocument) {
  const experience = parsedDocument.structuredResume?.experience ?? [];
  const years = experience
    .flatMap((item) => [item.startDate, item.endDate, ...item.rawLines])
    .filter((value): value is string => Boolean(value))
    .flatMap((value) => value.match(/\b(?:19|20)\d{2}\b/g) ?? [])
    .map(Number)
    .filter((year) => year >= 1950 && year <= new Date().getFullYear());

  if (years.length === 0) {
    return undefined;
  }

  return Math.max(0, new Date().getFullYear() - Math.min(...years));
}

export function getResumeProfilePrefill(
  parsedDocument: ParsedResumeDocument,
): ResumeProfilePrefill {
  const structuredResume = parsedDocument.structuredResume;
  const currentExperience = structuredResume?.experience[0];
  const headline = structuredResume?.summary?.trim() || undefined;
  const industrySource = [
    currentExperience?.title,
    currentExperience?.company,
    headline,
    ...(structuredResume?.skills ?? []),
  ]
    .filter(Boolean)
    .join(" ");

  return {
    name: structuredResume?.name
      ? cleanProfileName(structuredResume.name)
      : undefined,
    location: structuredResume?.contact.location?.trim() || undefined,
    currentTitle:
      currentExperience?.title && currentExperience.title !== "Role"
        ? currentExperience.title.trim()
        : undefined,
    currentIndustry: inferIndustry(industrySource),
    headline,
    skills: structuredResume?.skills ?? [],
    yearsExperience: estimateYearsExperience(parsedDocument),
  };
}
