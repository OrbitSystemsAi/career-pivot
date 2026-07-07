"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";

export default function ResumeModule() {
  const { user, activeResumeId } = useUser();

  const activeResume =
    user.resumes.find((resume) => resume.id === activeResumeId) ??
    user.resumes[0];

  const targetGoal = user.goals.find(
    (goal) => goal.id === activeResume?.targetGoalId
  );

  return (
    <div className="grid h-full min-h-[520px] grid-cols-[1fr_22rem] gap-4 overflow-auto">
      <PanelCard title="Resume Intelligence Summary">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <div className="text-3xl font-bold text-blue-600">
              84%
            </div>

            <div className="mt-2 text-xs font-semibold text-slate-500">
              Resume Score
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <div className="text-3xl font-bold text-blue-600">
              76%
            </div>

            <div className="mt-2 text-xs font-semibold text-slate-500">
              ATS Match
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <div className="text-3xl font-bold text-blue-600">
              91%
            </div>

            <div className="mt-2 text-xs font-semibold text-slate-500">
              Role Alignment
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <div className="text-3xl font-bold text-blue-600">
              High
            </div>

            <div className="mt-2 text-xs font-semibold text-slate-500">
              Recruiter Readiness
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase text-slate-500">
            Target
          </div>

          <div className="mt-2 text-sm font-semibold text-slate-700">
            {targetGoal?.title ?? activeResume?.targetJobTitle}
          </div>

          <div className="mt-1 text-xs text-slate-500">
            Optimizing resume language, keywords, and positioning.
          </div>
        </div>
      </PanelCard>

      <PanelCard title="AI Recommendations">
        <ActionRow
          label="Strength"
          value="Leadership"
        />

        <ActionRow
          label="Strength"
          value="Analytics"
        />

        <ActionRow
          label="Improve"
          value="AI Keywords"
        />

        <ActionRow
          label="Improve"
          value="Executive Impact"
        />

        <ActionRow
          label="Suggested Action"
          action="Optimize"
        />

        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
          Summary combines ATS analysis, keyword scoring, and target-role
          alignment into a single recommendation view.
        </div>
      </PanelCard>
    </div>
  );
}