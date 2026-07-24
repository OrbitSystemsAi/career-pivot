"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getCareerIntelligence } from "@/modules/career/lib/careerIntelligence";
import CareerEmptyState from "./CareerEmptyState";

export default function CareerSuggestions() {
  const { user, activeResumeId } = useUser();
  const career = getCareerIntelligence(user, activeResumeId);

  if (!career.hasResume) {
    return (
      <PanelCard title="Suggestions">
        <CareerEmptyState />
      </PanelCard>
    );
  }

  const selectedCareer = career.selectedCareer?.label ?? "the selected career";
  const suggestions = [
    `Position the resume toward ${selectedCareer}.`,
    `Prepare examples for ${career.nextTitles[0] ?? "the next title"}.`,
    "Add measurable outcomes to the strongest work-history bullets.",
  ];

  return (
    <PanelCard title="Suggestions">
      {suggestions.map((item) => (
        <ActionRow key={item} label={item} />
      ))}
    </PanelCard>
  );
}
