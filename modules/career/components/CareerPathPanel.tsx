"use client";

import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getCareerIntelligence } from "@/modules/career/lib/careerIntelligence";
import CareerEmptyState from "./CareerEmptyState";

export default function CareerPathPanel() {
  const { user, activeResumeId } = useUser();
  const career = getCareerIntelligence(user, activeResumeId);

  if (!career.hasResume) {
    return (
      <PanelCard title="Next Titles">
        <CareerEmptyState />
      </PanelCard>
    );
  }

  return (
    <PanelCard title="Next Titles">
      <div className="relative px-1 py-2">
        <div className="absolute bottom-6 left-[13px] top-6 w-px bg-slate-200" />

        <div className="flex flex-col gap-1">
          {career.nextTitles.map((title, index) => (
            <div
              key={title}
              className={`relative grid grid-cols-[28px_1fr] items-center rounded-xl px-1 py-2 text-left text-xs font-medium ${
                index === 0 ? "bg-blue-50 text-blue-600" : "text-slate-500"
              }`}
            >
              <span
                className={`z-10 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                  index === 0
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {index + 1}
              </span>

              <span className="truncate">{title}</span>
            </div>
          ))}
        </div>
      </div>
    </PanelCard>
  );
}
