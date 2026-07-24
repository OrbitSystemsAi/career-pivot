"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getCareerIntelligence } from "@/modules/career/lib/careerIntelligence";
import CareerEmptyState from "./CareerEmptyState";

export default function CareerMarketActions() {
  const { user, activeResumeId } = useUser();
  const career = getCareerIntelligence(user, activeResumeId);

  if (!career.hasCompletedGoal) {
    return (
      <PanelCard title="Actions">
        <CareerEmptyState />
      </PanelCard>
    );
  }

  return (
    <PanelCard title="Actions">
      <ActionRow
        label="Select at least one path"
        value={career.selectedCareers.length ? "complete" : "required"}
      />
      <ActionRow label="Compare route outcomes" action="Review" />
      <ActionRow
        label="Add resume evidence"
        value={career.hasResume ? "added" : "optional"}
      />
    </PanelCard>
  );
}
