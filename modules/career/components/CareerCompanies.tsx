"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getCareerIntelligence } from "@/modules/career/lib/careerIntelligence";
import CareerEmptyState from "./CareerEmptyState";

export default function CareerCompanies() {
  const { user, activeResumeId } = useUser();
  const career = getCareerIntelligence(user, activeResumeId);

  if (!career.hasResume) {
    return (
      <PanelCard title="Evidence">
        <CareerEmptyState />
      </PanelCard>
    );
  }

  const evidence =
    career.selectedCareer?.evidence.length
      ? career.selectedCareer.evidence
      : career.experienceTitles.slice(0, 4);

  return (
    <PanelCard title="Evidence">
      {evidence.map((item) => (
        <ActionRow key={item} label={item} />
      ))}
    </PanelCard>
  );
}
