"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";

const detectedKeywords = [
  {
    label: "Finance leadership",
    value: "Strong",
  },
  {
    label: "Business intelligence",
    value: "Strong",
  },
  {
    label: "Executive reporting",
    value: "Strong",
  },
  {
    label: "Digital transformation",
    value: "Moderate",
  },
];

const missingKeywords = [
  {
    label: "AI governance",
    value: "Missing",
  },
  {
    label: "Enterprise architecture",
    value: "Missing",
  },
  {
    label: "Healthcare operations",
    value: "Missing",
  },
  {
    label: "Change management",
    value: "Weak",
  },
];

export default function ResumeKeywords() {
  const { user, activeResumeId, optimizeResume } = useUser();

  const activeResume =
    user.resumes.find((resume) => resume.id === activeResumeId) ??
    user.resumes[0];

  const targetGoal = user.goals.find(
    (goal) => goal.id === activeResume?.targetGoalId
  );

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
            Keywords currently supported by{" "}
            {activeResume?.name ?? "the selected resume"}.
          </div>

          <div className="space-y-1">
            {detectedKeywords.map((keyword) => (
              <ActionRow
                key={keyword.label}
                label={keyword.label}
                value={keyword.value}
              />
            ))}
          </div>
        </PanelCard>

        <PanelCard title="Keyword Opportunities">
          <div className="mb-3 text-xs leading-5 text-slate-500">
            Recommended terms for {targetGoal?.title ?? "the target role"}.
          </div>

          <div className="space-y-1">
            {missingKeywords.map((keyword) => (
              <ActionRow
                key={keyword.label}
                label={keyword.label}
                value={keyword.value}
              />
            ))}
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