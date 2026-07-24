"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getResumeIntelligence } from "@/modules/resume/lib/resumeIntelligence";
import { resumeStrengths } from "../data/resumeData";

export default function ResumeStrengths() {
  const { user, activeResumeId } = useUser();
  const { hasResume } = getResumeIntelligence(user, activeResumeId);

  return (
    <PanelCard title="Strengths">
      {hasResume ? (
        resumeStrengths.map((item) => <ActionRow key={item} label={item} />)
      ) : (
        <ActionRow label="Please upload to get started" />
      )}
    </PanelCard>
  );
}
