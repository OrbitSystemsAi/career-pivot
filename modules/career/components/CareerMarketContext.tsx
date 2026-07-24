"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getCareerIntelligence } from "@/modules/career/lib/careerIntelligence";
import CareerEmptyState from "./CareerEmptyState";

export default function CareerMarketContext() {
  const { user, activeResumeId } = useUser();
  const career = getCareerIntelligence(user, activeResumeId);

  if (!career.hasCompletedGoal) {
    return (
      <PanelCard title="Path Context">
        <CareerEmptyState />
      </PanelCard>
    );
  }

  return (
    <PanelCard title="Path Context">
      <ActionRow
        label="Evidence"
        value={career.hasResume ? "Goal + resume" : "Goal only"}
      />
      <ActionRow
        label="Exploring"
        value={career.selectedCareer?.label ?? "Choose path"}
      />
      <ActionRow
        label="Committed"
        value={career.selectedCareers.length ? "Yes" : "Not yet"}
      />
    </PanelCard>
  );
}
