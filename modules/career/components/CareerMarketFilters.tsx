"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getCareerIntelligence } from "@/modules/career/lib/careerIntelligence";
import CareerEmptyState from "./CareerEmptyState";

export default function CareerMarketFilters() {
  const { user, activeResumeId } = useUser();
  const career = getCareerIntelligence(user, activeResumeId);

  if (!career.hasCompletedGoal) {
    return (
      <PanelCard title="Path Choices">
        <CareerEmptyState />
      </PanelCard>
    );
  }

  return (
    <PanelCard title="Path Choices">
      <ActionRow
        label="Goal"
        value={career.completedGoal?.title ?? "Complete goal"}
      />
      <ActionRow
        label="Selected paths"
        value={String(career.selectedCareers.length)}
      />
    </PanelCard>
  );
}
