"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";

const atsBreakdown = [
  {
    label: "Title Alignment",
    value: "82%",
  },
  {
    label: "Keyword Match",
    value: "76%",
  },
  {
    label: "Leadership Signals",
    value: "88%",
  },
  {
    label: "Industry Fit",
    value: "71%",
  },
];

const missingKeywords = [
  "AI governance",
  "enterprise architecture",
  "change management",
  "healthcare operations",
];

export default function ResumeATS() {
  const { user, activeResumeId, optimizeResume } = useUser();

  const activeResume =
    user.resumes.find((resume) => resume.id === activeResumeId) ??
    user.resumes[0];

  const targetGoal = user.goals.find(
    (goal) => goal.id === activeResume?.targetGoalId
  );

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
            <div className="text-5xl font-bold text-blue-600">76%</div>

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
            {missingKeywords.map((keyword) => (
              <ActionRow key={keyword} label={keyword} action="Add" />
            ))}
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