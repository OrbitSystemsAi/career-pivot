"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getCareerIntelligence } from "@/modules/career/lib/careerIntelligence";
import CareerEmptyState from "./CareerEmptyState";

export default function CareerWords() {
  const { user, activeResumeId } = useUser();
  const career = getCareerIntelligence(user, activeResumeId);

  if (!career.hasResume) {
    return (
      <PanelCard title="Keywords">
        <CareerEmptyState />
      </PanelCard>
    );
  }

  const words =
    career.selectedCareer?.keywords.slice(0, 4) ?? career.skills.slice(0, 4);

  return (
    <PanelCard title="Keywords">
      {words.map((item) => (
        <ActionRow key={item} label={item} />
      ))}
    </PanelCard>
  );
}
