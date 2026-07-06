"use client";

import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import ResumeUpload from "./ResumeUpload";

export default function ResumeFilters() {
  const { user, activeResumeId, setActiveResumeId, removeResume } = useUser();

  return (
    <PanelCard title="Resume Library">
      <div className="flex flex-col gap-1">
        {user.resumes.map((resume) => {
          const selected = resume.id === activeResumeId;

          return (
            <div
              key={resume.id}
              className={`grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium ${
                selected
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <button
                onClick={() => setActiveResumeId(resume.id)}
                className="truncate text-left"
              >
                {resume.name}
              </button>

              <span className="text-slate-400">{resume.status}</span>

              <button
                onClick={() => removeResume(resume.id)}
                className="text-slate-400 hover:text-red-500"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <ResumeUpload />
    </PanelCard>
  );
}