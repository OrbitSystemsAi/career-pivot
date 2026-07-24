import type { UserProfile } from "@/core/user/userTypes";
import { getSelectedCareerChoices } from "@/modules/career/lib/careerIntelligence";
import { getResumeIntelligence } from "@/modules/resume/lib/resumeIntelligence";
import type {
  CareerJobOpportunity,
  CareerOpportunityIntelligence,
  OpportunityPrerequisite,
  OpportunityScore,
} from "./opportunityTypes";

const organizations = [
  "Northstar Financial Group",
  "Horizon Health Systems",
  "Atlas Enterprise Partners",
];

const locations = ["Remote — United States", "Miami, FL", "Fort Lauderdale, FL"];
const workModes = ["Remote", "Hybrid", "On-site"] as const;
const salaryBands = ["$145K–$185K", "$132K–$172K", "$155K–$205K"];

function clamp(value: number) {
  return Math.min(98, Math.max(35, Math.round(value)));
}

function weightedOverall(scores: OpportunityScore[]) {
  const weights = {
    career: 0.35,
    experience: 0.25,
    education: 0.1,
    certifications: 0.1,
    resume: 0.2,
  } as const;
  const available = scores.filter(
    (score): score is OpportunityScore & { value: number } =>
      score.value !== null
  );
  const weightTotal = available.reduce(
    (total, score) => total + weights[score.key],
    0
  );

  if (!weightTotal) return 0;

  return Math.round(
    available.reduce(
      (total, score) => total + score.value * weights[score.key],
      0
    ) / weightTotal
  );
}

export function getOpportunityPrerequisites(
  user: UserProfile
): OpportunityPrerequisite[] {
  const hasCompleteGoal = user.goals.some(
    (goal) =>
      Boolean(goal.setupCompletedAt) &&
      Boolean(goal.statement.trim()) &&
      Boolean(goal.guidance.generatedAt) &&
      goal.successCriteria.some((criterion) => criterion.accepted)
  );
  const hasCareerPaths = getSelectedCareerChoices(user).length > 0;
  const hasUploadedResume = user.resumes.some(
    (resume) =>
      resume.source === "upload" &&
      resume.versions.some((version) => Boolean(version.parsedDocument))
  );

  return [
    { key: "goal", label: "Career Goals", complete: hasCompleteGoal },
    { key: "paths", label: "Career Paths", complete: hasCareerPaths },
    { key: "resume", label: "Upload Resume", complete: hasUploadedResume },
  ];
}

export function getCareerOpportunityIntelligence(
  user: UserProfile,
  activeResumeId: string
): CareerOpportunityIntelligence {
  const prerequisites = getOpportunityPrerequisites(user);
  const isReady = prerequisites.every((requirement) => requirement.complete);
  const choices = getSelectedCareerChoices(user);
  const resume = getResumeIntelligence(user, activeResumeId);
  const structuredResume = resume.structuredResume;
  const experienceCount = structuredResume?.experience.length ?? 0;
  const educationCount = structuredResume?.education.length ?? 0;
  const certificationCount = structuredResume?.certifications.length ?? 0;
  const skillCount = structuredResume?.skills.length ?? 0;

  if (!isReady) {
    return {
      prerequisites,
      isReady,
      paths: [],
      totalJobs: 0,
      scoredJobs: 0,
      bestScore: null,
      hasResume: resume.hasResume,
      resumeLabel: resume.activeVersion?.label,
    };
  }

  const paths = choices.map((choice, pathIndex) => {
    const jobs = choice.nextTitles.slice(0, 3).map((title, jobIndex) => {
      const careerScore = clamp(94 - jobIndex * 5);
      const experienceScore = resume.hasResume
        ? clamp(48 + experienceCount * 7 + Math.min(skillCount, 12) * 2 - jobIndex * 2)
        : null;
      const educationScore = resume.hasResume && educationCount
        ? clamp(76 + educationCount * 5 - jobIndex)
        : null;
      const certificationScore = resume.hasResume && certificationCount
        ? clamp(72 + certificationCount * 6 - jobIndex)
        : null;
      const resumeScore = resume.hasResume
        ? clamp(resume.resumeScore - jobIndex * 2)
        : null;
      const scores: OpportunityScore[] = [
        {
          key: "career",
          label: "Career direction",
          value: careerScore,
          explanation: `The role directly supports your selected ${choice.label} path.`,
        },
        {
          key: "experience",
          label: "Experience",
          value: experienceScore,
          explanation: experienceScore === null
            ? "Upload a resume to score experience evidence."
            : `Based on ${experienceCount} documented role${experienceCount === 1 ? "" : "s"} and ${skillCount} resume skill${skillCount === 1 ? "" : "s"}.`,
        },
        {
          key: "education",
          label: "Education",
          value: educationScore,
          explanation: educationScore === null
            ? "No education evidence is available in the current resume."
            : `Based on ${educationCount} education record${educationCount === 1 ? "" : "s"}.`,
        },
        {
          key: "certifications",
          label: "Certifications",
          value: certificationScore,
          explanation: certificationScore === null
            ? "No certification evidence is available in the current resume."
            : `Based on ${certificationCount} documented certification${certificationCount === 1 ? "" : "s"}.`,
        },
        {
          key: "resume",
          label: "Current resume",
          value: resumeScore,
          explanation: resumeScore === null
            ? "Upload or generate a resume to score application readiness."
            : `Uses ${resume.activeVersion?.label ?? "the current resume version"}.`,
        },
      ];
      const evidenceCoverage = scores.filter((score) => score.value !== null).length;
      const job: CareerJobOpportunity = {
        id: `${choice.id}-job-${jobIndex + 1}`,
        pathId: choice.id,
        title,
        organization: organizations[(pathIndex + jobIndex) % organizations.length],
        location: locations[jobIndex % locations.length],
        workMode: workModes[jobIndex % workModes.length],
        employmentType: jobIndex === 2 ? "Contract" : "Full-time",
        salary: salaryBands[(pathIndex + jobIndex) % salaryBands.length],
        postedLabel: jobIndex === 0 ? "Added today" : `${jobIndex + 1} days ago`,
        sourceLabel: "Planning preview",
        live: false,
        overallScore: weightedOverall(scores),
        evidenceCoverage,
        scores,
        fitReasons: [
          `Directly tied to your ${choice.label} selection in Career.`,
          `${title} is one of the next titles defined for this path.`,
          resume.hasResume
            ? "Current resume evidence is included in the score."
            : "Career fit is provisional until resume evidence is available.",
        ],
        gaps: scores
          .filter((score) => score.value === null)
          .map((score) => score.explanation),
        description: `A ${choice.label.toLowerCase()} opportunity focused on enterprise outcomes, measurable change, and cross-functional leadership.`,
      };

      return job;
    });

    return {
      id: choice.id,
      label: choice.label,
      choiceNumber: pathIndex + 1,
      jobs,
    };
  });
  const jobs = paths.flatMap((path) => path.jobs);

  return {
    prerequisites,
    isReady,
    paths,
    totalJobs: jobs.length,
    scoredJobs: jobs.filter((job) => job.evidenceCoverage === 5).length,
    bestScore: jobs.length
      ? Math.max(...jobs.map((job) => job.overallScore))
      : null,
    hasResume: resume.hasResume,
    resumeLabel: resume.activeVersion?.label,
  };
}
