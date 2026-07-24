import type { UserProfile } from "@/core/user/userTypes";
import type { PlanEvidence } from "@/core/planning/planningTypes";
import {
  getActiveResume,
  getActiveResumeVersion,
} from "@/modules/resume/lib/resumeIntelligence";

function normalizeKeywords(values: string[]) {
  return Array.from(
    new Set(
      values
        .flatMap((value) => value.toLowerCase().split(/[^a-z0-9+#.]+/))
        .filter((value) => value.length > 2)
    )
  );
}

export function collectUserEvidence(
  user: UserProfile,
  activeResumeId: string
): PlanEvidence[] {
  const resume = getActiveResume(user, activeResumeId);
  const version = getActiveResumeVersion(resume);
  const structured = version?.parsedDocument?.structuredResume;
  const evidence: PlanEvidence[] = [];

  if (user.currentTitle) {
    evidence.push({
      id: "profile-current-role",
      claim: `Current role: ${user.currentTitle}`,
      detail: user.currentIndustry || "Provided in profile",
      source: "profile",
      sourceLabel: "User profile",
      strength: "moderate",
      confidence: 0.72,
      keywords: normalizeKeywords([user.currentTitle, user.currentIndustry]),
    });
  }

  user.skills.forEach((skill, index) => {
    evidence.push({
      id: `profile-skill-${index}`,
      claim: skill,
      detail: "Self-reported skill",
      source: "profile",
      sourceLabel: "User profile",
      strength: "weak",
      confidence: 0.55,
      keywords: normalizeKeywords([skill]),
    });
  });

  structured?.experience.forEach((experience, index) => {
    const detail = [experience.company, ...experience.bullets.slice(0, 2)]
      .filter(Boolean)
      .join(" — ");
    evidence.push({
      id: `experience-${experience.id || index}`,
      claim: experience.title || "Documented work experience",
      detail,
      source: "resume_experience",
      sourceLabel: version?.parsedDocument?.fileName ?? "Resume",
      strength: experience.bullets.length ? "strong" : "moderate",
      confidence: experience.bullets.length ? 0.88 : 0.7,
      keywords: normalizeKeywords([
        experience.title,
        experience.company,
        ...experience.bullets,
      ]),
    });
  });

  structured?.skills.forEach((skill, index) => {
    evidence.push({
      id: `resume-skill-${index}`,
      claim: skill,
      detail: "Listed in résumé skills",
      source: "resume_skill",
      sourceLabel: version?.parsedDocument?.fileName ?? "Resume",
      strength: "moderate",
      confidence: 0.68,
      keywords: normalizeKeywords([skill]),
    });
  });

  structured?.education.forEach((education, index) => {
    evidence.push({
      id: `education-${index}`,
      claim: education,
      detail: "Documented education",
      source: "resume_education",
      sourceLabel: version?.parsedDocument?.fileName ?? "Resume",
      strength: "strong",
      confidence: 0.9,
      keywords: normalizeKeywords([education]),
    });
  });

  structured?.certifications.forEach((certification, index) => {
    evidence.push({
      id: `certification-${index}`,
      claim: certification,
      detail: "Documented certification",
      source: "resume_certification",
      sourceLabel: version?.parsedDocument?.fileName ?? "Resume",
      strength: "strong",
      confidence: 0.9,
      keywords: normalizeKeywords([certification]),
    });
  });

  const goal = user.goals[0];
  if (goal) {
    evidence.push({
      id: "goal-intent",
      claim: goal.statement,
      detail: goal.motivation || "User-defined target",
      source: "user_goal",
      sourceLabel: "Goal statement",
      strength: "moderate",
      confidence: 1,
      keywords: normalizeKeywords([goal.statement, goal.motivation]),
    });

    goal.constraints.forEach((constraint, index) => {
      evidence.push({
        id: `context-${index}`,
        claim: constraint,
        detail: "Planning constraint",
        source: "user_context",
        sourceLabel: "Goal context",
        strength: "strong",
        confidence: 1,
        keywords: normalizeKeywords([constraint]),
      });
    });

    user.planningProgress.submittedEvidence
      .filter((item) => item.goalId === goal.id)
      .forEach((item) => {
        evidence.push({
          id: item.id,
          claim: item.claim,
          detail: item.detail,
          source: "user_submitted",
          sourceLabel: "Roadmap evidence",
          strength: "strong",
          confidence: 0.9,
          keywords: normalizeKeywords([item.claim, item.detail]),
        });
      });
  }

  return evidence;
}
