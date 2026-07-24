"use client";

import { styles } from "@/core/design/styles";
import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getResumeIntelligence } from "@/modules/resume/lib/resumeIntelligence";

export default function ResumeContext() {
  const { user, activeResumeId, updateResumeTargetGoal } = useUser();

  const { activeResume, hasResume } = getResumeIntelligence(user, activeResumeId);

  const targetGoal = user.goals.find(
    (goal) => goal.id === activeResume?.targetGoalId
  );

  return (
    <PanelCard title="Resume Context">
      {hasResume && activeResume ? (
        <div className="mb-3">
          <label className={styles.text.label}>
            Target Goal
          </label>

          <select
            value={activeResume.targetGoalId}
            onChange={(event) =>
              updateResumeTargetGoal(activeResume.id, event.target.value)
            }
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              py-2
              text-xs
              text-slate-700
              transition
              hover:bg-blue-50
              hover:text-slate-900
              focus:outline-none
            "
          >
            {user.goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <ActionRow label="Please upload to get started" />
      )}

      <ActionRow
        label="Resume"
        value={activeResume?.name ?? "No resume"}
      />

      <ActionRow
        label="Target Role"
        value={targetGoal?.title ?? "Not selected"}
      />

      <ActionRow
        label="Industry"
        value={targetGoal?.industry ?? "Not selected"}
      />

      <ActionRow
        label="Work Setup"
        value={targetGoal?.workPreference ?? "Not selected"}
      />
    </PanelCard>
  );
}
