import { analyzeResume } from "@/core/analysis/resume/resumeAnalysisEngine";
import { buildStructuredResume } from "@/core/resumeParsing/buildStructuredResume";
import type { UserProfile, UserResume } from "@/core/user/userTypes";

export const resumeTargetKeywords = [
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

export function getActiveResume(
  user: UserProfile,
  activeResumeId: string
) {
  return (
    user.resumes.find((resume) => resume.id === activeResumeId) ??
    user.resumes[0]
  );
}

export function getActiveResumeVersion(
  activeResume: UserResume | undefined
) {
  return (
    activeResume?.versions.find(
      (version) => version.id === activeResume.currentVersionId
    ) ?? activeResume?.versions[0]
  );
}

export function getResumeIntelligence(
  user: UserProfile,
  activeResumeId: string
) {
  const activeResume = getActiveResume(user, activeResumeId);
  const activeVersion = getActiveResumeVersion(activeResume);
  const parsedDocument = activeVersion?.parsedDocument;
  const structuredResume =
    parsedDocument?.structuredResume ??
    (parsedDocument?.lines.length
      ? buildStructuredResume(parsedDocument.lines)
      : undefined);
  const analysis = analyzeResume(user, activeResumeId);

  return {
    hasResume: analysis.hasResume,
    activeResume,
    activeVersion,
    parsedDocument,
    structuredResume,

    skillCount: structuredResume?.skills.length ?? 0,

    experienceCount: structuredResume?.experience.length ?? 0,

    detectedKeywords: analysis.target.detectedKeywords,
    missingKeywords: analysis.target.missingKeywords,

    resumeScore: analysis.resumeQualityScore,
    atsScore: analysis.target.atsScore,
    gapCount: analysis.issueCount,

    currentScore: analysis.current.overallScore,
    targetScore: analysis.target.overallScore,
    currentAtsScore: analysis.current.atsScore,
    targetAtsScore: analysis.target.atsScore,

    analysis,
  };
}
