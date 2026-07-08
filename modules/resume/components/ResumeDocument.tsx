"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";

const targetKeywords = [
  "AI governance",
  "enterprise architecture",
  "change management",
  "healthcare operations",
  "digital transformation",
  "data strategy",
  "executive reporting",
  "automation",
];

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function getDetectedKeywords(skills: string[], rawText: string) {
  const normalizedText = normalize(rawText);

  return targetKeywords.filter((keyword) => {
    const normalizedKeyword = normalize(keyword);

    return (
      normalizedText.includes(normalizedKeyword) ||
      skills.some((skill) => normalize(skill).includes(normalizedKeyword))
    );
  });
}

function getMissingKeywords(skills: string[], rawText: string) {
  const detected = getDetectedKeywords(skills, rawText);

  return targetKeywords.filter((keyword) => !detected.includes(keyword));
}

export default function ResumeATS() {
  const { user, activeResumeId, optimizeResume } = useUser();

  const activeResume =
    user.resumes.find((resume) => resume.id === activeResumeId) ??
    user.resumes[0];

  const activeVersion =
    activeResume?.versions.find(
      (version) => version.id === activeResume.currentVersionId
    ) ?? activeResume?.versions[0];

  const parsedDocument = activeVersion?.parsedDocument;
  const structuredResume = parsedDocument?.structuredResume;

  const targetGoal = user.goals.find(
    (goal) => goal.id === activeResume?.targetGoalId
  );

  const skills = structuredResume?.skills ?? user.skills;
  const rawText = parsedDocument?.rawText ?? skills.join(" ");

  const detectedKeywords = getDetectedKeywords(skills, rawText);
  const missingKeywords = getMissingKeywords(skills, rawText);

  const keywordScore =
    targetKeywords.length > 0
      ? Math.round((detectedKeywords.length / targetKeywords.length) * 100)
      : 0;

  const titleAlignment = targetGoal?.title ? 82 : 55;
  const leadershipSignals = rawText.toLowerCase().includes("leader") ? 88 : 65;
  const industryFit = targetGoal?.industry
    ? rawText.toLowerCase().includes(targetGoal.industry.toLowerCase())
      ? 84
      : 71
    : 60;

  const atsScore = Math.round(
    (keywordScore + titleAlignment + leadershipSignals + industryFit) / 4
  );

  const atsBreakdown = [
    {
      label: "Title Alignment",
      value: `${titleAlignment}%`,
    },
    {
      label: "Keyword Match",
      value: `${keywordScore}%`,
    },
    {
      label: "Leadership Signals",
      value: `${leadershipSignals}%`,
    },
    {
      label: "Industry Fit",
      value: `${industryFit}%`,
    },
  ];

  function handleOptimizeATS() {
    if (!activeResume) {
      return;
    }

    optimizeResume(activeResume.id, "ats");
  }

  return (
    <div className="h-full w-full overflow-auto">
      <div className="grid h-full min-h-[520px] grid-cols-[1fr_22rem] gap-4">
        <PanelCard title="ATS Alignment">
          <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-6">
            <div className="text-5xl font-bold text-blue-600">
              {atsScore}%
            </div>

            <div className="mt-2 text-sm font-semibold text-slate-700">
              ATS Match Score
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {activeResume?.name ?? "Selected resume"} →{" "}
              {targetGoal?.title ?? "Target role"}
            </div>
          </div>

          <div className="space-y-1">
            {atsBreakdown.map((item) => (
              <ActionRow
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
        </PanelCard>

        <PanelCard title="ATS Improvements">
          <div className="mb-3 text-xs leading-5 text-slate-500">
            Add these terms naturally where they are supported by real
            experience.
          </div>

          <div className="space-y-1">
            {missingKeywords.length === 0 ? (
              <ActionRow label="No major keyword gaps" value="Good" />
            ) : (
              missingKeywords.map((keyword) => (
                <ActionRow key={keyword} label={keyword} action="Add" />
              ))
            )}
          </div>

          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
            ATS optimization should improve alignment without keyword stuffing
            or changing the truth of the resume.
          </div>

          <div className="mt-4">
            <ActionRow
              label="Create ATS Optimized Version"
              action="Run"
              onClick={handleOptimizeATS}
            />
          </div>
        </PanelCard>
      </div>
    </div>
  );
}