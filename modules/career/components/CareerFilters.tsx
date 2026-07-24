"use client";

import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getCareerIntelligence } from "@/modules/career/lib/careerIntelligence";
import CareerEmptyState from "./CareerEmptyState";

export default function CareerFilters() {
  const { user, activeResumeId, updateCareerPreference } = useUser();
  const career = getCareerIntelligence(user, activeResumeId);

  if (!career.hasResume) {
    return (
      <PanelCard title="Career">
        <CareerEmptyState />
      </PanelCard>
    );
  }

  function toggleCareer(optionId: string) {
    const currentIds = career.selectedCareers.map((option) => option.id);
    const selected = currentIds.includes(optionId);
    const nextIds = selected
      ? currentIds.filter((id) => id !== optionId)
      : [...currentIds, optionId];

    updateCareerPreference({
      selectedCareerIds: nextIds,
      selectedCareerId: nextIds[0],
      selectionConfirmedAt: new Date().toISOString(),
    });
  }

  return (
    <PanelCard title="Career Direction">
      <div className="flex flex-col gap-2 text-xs">
        <div className="rounded-xl bg-blue-50 px-3 py-2">
          <div className="text-slate-500">Current career</div>
          <div className="mt-1 font-semibold text-slate-900">
            {career.currentCareer?.label}
          </div>
        </div>

        {career.careerOptions.map((option) => (
          <label
            key={option.id}
            className="flex min-h-8 items-center gap-2 rounded-xl px-3 py-2 text-slate-500 transition hover:bg-blue-50 hover:text-slate-900"
          >
            <input
              type="checkbox"
              checked={career.selectedCareers.some(
                (careerOption) => careerOption.id === option.id
              )}
              onChange={() => toggleCareer(option.id)}
              className="h-3.5 w-3.5 border-slate-300 accent-blue-600"
            />
            <span className="min-w-0 flex-1 truncate">{option.label}</span>
            <span className="text-slate-900">{option.match}%</span>
          </label>
        ))}
      </div>
    </PanelCard>
  );
}
