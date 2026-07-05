"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";

export default function ResumeContext() {
  const { user, activeResumeId } = useUser();

  const activeResume =
    user.resumes.find((resume) => resume.id === activeResumeId) ??
    user.resumes[0];

  const targetGoal = user.goals.find(
    (goal) => goal.id === activeResume?.targetGoalId
  );

  const context = [
    {
      label: "Resume",
      value: activeResume?.name ?? "No resume",
    },
    {
      label: "Target Role",
      value: targetGoal?.title ?? "Not selected",
    },
    {
      label: "Industry",
      value: targetGoal?.industry ?? "Not selected",
    },
    {
      label: "Work Setup",
      value: targetGoal?.workPreference ?? "Not selected",
    },
  ];

  return (
    <PanelCard title="Resume Context">
      {context.map((item) => (
        <ActionRow key={item.label} label={item.label} value={item.value} />
      ))}
    </PanelCard>
  );
}