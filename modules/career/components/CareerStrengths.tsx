"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getCareerIntelligence } from "@/modules/career/lib/careerIntelligence";
import CareerEmptyState from "./CareerEmptyState";

export default function CareerStrengths() {
  const { user, activeResumeId } = useUser();
  const career = getCareerIntelligence(user, activeResumeId);

  if (!career.hasResume) {
    return (
      <PanelCard title="Strengths">
        <CareerEmptyState />
      </PanelCard>
    );
  }

  const strengths = career.skills.slice(0, 4);

  return (
    <PanelCard title="Strengths">
      {strengths.length > 0 ? (
        strengths.map((item) => <ActionRow key={item} label={item} />)
      ) : (
        <ActionRow label="Skills will appear as resume parsing improves." />
      )}
    </PanelCard>
  );
}
