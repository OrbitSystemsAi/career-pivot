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
  "business intelligence",
  "finance leadership",
];

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function getDetectedKeywords(skills: string[], rawText: string) {
  const normalizedText = normalize(rawText);

  const detectedTargetKeywords = targetKeywords.filter((keyword) =>
    normalizedText.includes(normalize(keyword))
  );

  return unique([...skills, ...detectedTargetKeywords]);
}

function getMissingKeywords(detectedKeywords: string[]) {
  const normalizedDetected = detectedKeywords.map(normalize);

  return targetKeywords.filter(
    (keyword) =>
      !normalizedDetected.some((detected) =>
        detected.includes(normalize(keyword))
      )
  );
}

export default function ResumeKeywords() {
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
  const missingKeywords = getMissingKeywords(detectedKeywords);

  function handleOptimizeKeywords() {
    if (!activeResume) {
      return;
    }

    optimizeResume(activeResume.id, "keywords");
  }

  return (
    <div className="h-full w-full overflow-auto">
      <div className="grid h-full min-h-[520px] grid-cols-2 gap-4">
        <PanelCard title="Detected Keywords">
          <div className="mb-3 text-xs leading-5 text-slate-500">
            Keywords currently detected in{" "}
            {activeResume?.name ?? "the selected resume"}.
          </div>

          <div className="space-y-1">
            {detectedKeywords.length === 0 ? (
              <ActionRow label="No keywords detected" value="0" />
            ) : (
              detectedKeywords.map((keyword) => (
                <ActionRow
                  key={keyword}
                  label={keyword}
                  value={
                    targetKeywords
                      .map(normalize)
                      .includes(normalize(keyword))
                      ? "Target"
                      : "Detected"
                  }
                />
              ))
            )}
          </div>
        </PanelCard>

        <PanelCard title="Keyword Opportunities">
          <div className="mb-3 text-xs leading-5 text-slate-500">
            Recommended terms for {targetGoal?.title ?? "the target role"}.
          </div>

          <div className="space-y-1">
            {missingKeywords.length === 0 ? (
              <ActionRow label="No major keyword gaps" value="Good" />
            ) : (
              missingKeywords.map((keyword) => (
                <ActionRow key={keyword} label={keyword} value="Missing" />
              ))
            )}
          </div>

          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
            Add keywords only when they are supported by real experience,
            projects, achievements, or measurable outcomes.
          </div>

          <div className="mt-4">
            <ActionRow
              label="Create Keyword Optimized Version"
              action="Run"
              onClick={handleOptimizeKeywords}
            />
          </div>
        </PanelCard>
      </div>
    </div>
  );
}