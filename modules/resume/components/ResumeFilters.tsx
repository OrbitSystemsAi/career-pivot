"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";

export default function ResumeFilters() {
  const { user, activeResumeId, setActiveResumeId } = useUser();

  return (
    <PanelCard title="Resume Library">
      <div className="flex flex-col gap-1">
        {user.resumes.map((resume) => {
          const selected = resume.id === activeResumeId;

          return (
            <button
              key={resume.id}
              onClick={() => setActiveResumeId(resume.id)}
              className={`flex w-full justify-between rounded-xl px-3 py-2 text-left text-xs font-medium ${
                selected
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <span>{resume.name}</span>
              <span>{resume.status}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 border-t border-slate-100 pt-3">
        <ActionRow label="Upload new resume" action="Add" />
      </div>
    </PanelCard>
  );
}