"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getCareerIntelligence } from "@/modules/career/lib/careerIntelligence";
import CareerEmptyState from "./CareerEmptyState";

export default function CareerMarketDemand() {
  const { user, activeResumeId } = useUser();
  const career = getCareerIntelligence(user, activeResumeId);

  if (!career.hasCompletedGoal) {
    return (
      <PanelCard title="Goal Signals">
        <CareerEmptyState />
      </PanelCard>
    );
  }

  return (
    <PanelCard title="Goal Signals">
      {(career.selectedCareer?.keywords.slice(0, 3) ?? []).map((keyword) => (
        <ActionRow
          key={keyword}
          label={keyword}
          value={career.selectedCareer?.evidence.includes(keyword) ? "found" : "verify"}
        />
      ))}
    </PanelCard>
  );
}
