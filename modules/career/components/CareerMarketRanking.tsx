"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getCareerIntelligence } from "@/modules/career/lib/careerIntelligence";
import CareerEmptyState from "./CareerEmptyState";

export default function CareerMarketRanking() {
  const { user, activeResumeId } = useUser();
  const career = getCareerIntelligence(user, activeResumeId);

  if (!career.hasCompletedGoal) {
    return (
      <PanelCard title="Path Alignment">
        <CareerEmptyState />
      </PanelCard>
    );
  }

  return (
    <PanelCard title="Path Alignment">
      {career.careerOptions.slice(0, 3).map((option) => (
        <ActionRow
          key={option.id}
          label={option.label}
          value={`${option.match}%`}
        />
      ))}
    </PanelCard>
  );
}
