"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getCareerIntelligence } from "@/modules/career/lib/careerIntelligence";
import CareerEmptyState from "./CareerEmptyState";

export default function CareerMarketCompanies() {
  const { user, activeResumeId } = useUser();
  const career = getCareerIntelligence(user, activeResumeId);

  if (!career.hasCompletedGoal) {
    return (
      <PanelCard title="Career Evidence">
        <CareerEmptyState />
      </PanelCard>
    );
  }

  const evidence =
    career.selectedCareer?.evidence.length
      ? career.selectedCareer.evidence
      : career.skills.slice(0, 3);

  return (
    <PanelCard title="Career Evidence">
      {evidence.map((item) => (
      <ActionRow key={item} label={item} value="found" />
      ))}
    </PanelCard>
  );
}
