"use client";

import { useUser } from "@/core/user/UserProvider";
import { resumeScore } from "../data/resumeData";

export default function ResumeModule() {
  const { user, activeResumeId } = useUser();

  const activeResume =
    user.resumes.find((resume) => resume.id === activeResumeId) ??
    user.resumes[0];

  const targetGoal = user.goals.find(
    (goal) => goal.id === activeResume?.targetGoalId
  );

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="text-5xl font-bold text-blue-600">
          {resumeScore.score}%
        </div>

        <div className="mt-3 text-sm font-medium text-slate-700">
          Resume Alignment
        </div>

        <div className="mt-2 text-xs text-slate-500">
          {activeResume?.name}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          Target: {targetGoal?.title ?? resumeScore.target}
        </div>

        <div className="mt-4 rounded-xl bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600">
          {resumeScore.alignment} improvement available
        </div>
      </div>
    </div>
  );
}