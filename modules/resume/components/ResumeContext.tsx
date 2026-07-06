"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";

export default function ResumeContext() {
  const { user, activeResumeId, updateResumeTargetGoal } = useUser();

  const activeResume =
    user.resumes.find((resume) => resume.id === activeResumeId) ??
    user.resumes[0];

  const targetGoal = user.goals.find(
    (goal) => goal.id === activeResume?.targetGoalId
  );

  return (
    <PanelCard title="Resume Context">
      <div className="mb-3">
        <label className="mb-2 block text-xs font-medium text-slate-400">
          Target Goal
        </label>

        <select
          value={activeResume?.targetGoalId ?? ""}
          onChange={(event) =>
            updateResumeTargetGoal(activeResume.id, event.target.value)
          }
          className="w-full rounded-xl border border-transparent bg-white px-3 py-2 text-xs font-medium text-slate-500 hover:border-slate-200 hover:bg-blue-50 hover:text-blue-600 focus:border-slate-200 focus:bg-white focus:outline-none"
        >
          {user.goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.title}
            </option>
          ))}
        </select>
      </div>

      <ActionRow label="Resume" value={activeResume?.name ?? "No resume"} />
      <ActionRow label="Target Role" value={targetGoal?.title ?? "Not selected"} />
      <ActionRow label="Industry" value={targetGoal?.industry ?? "Not selected"} />
      <ActionRow
        label="Work Setup"
        value={targetGoal?.workPreference ?? "Not selected"}
      />
    </PanelCard>
  );
}