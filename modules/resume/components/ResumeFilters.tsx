"use client";

import { useState } from "react";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import ResumeUpload from "./ResumeUpload";

export default function ResumeFilters() {
  const { user, activeResumeId, setActiveResumeId, removeResume } = useUser();

  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  function handleRemove(resumeId: string) {
    removeResume(resumeId);
    setConfirmRemoveId(null);
  }

  return (
    <PanelCard title="Resume Library">
      <div className="flex flex-col gap-1">
        {user.resumes.map((resume) => {
          const selected = resume.id === activeResumeId;
          const canRemove = resume.source === "upload";
          const confirming = confirmRemoveId === resume.id;

          return (
            <div
              key={resume.id}
              className={`rounded-xl px-3 py-2 text-xs font-medium ${
                selected
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {!confirming && (
                <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
                  <button
                    onClick={() => setActiveResumeId(resume.id)}
                    className="truncate text-left"
                  >
                    {resume.name}
                  </button>

                  <span className="text-slate-400">
                    {resume.source === "upload" ? "upload" : resume.status}
                  </span>

                  {canRemove ? (
                    <button
                      onClick={() => setConfirmRemoveId(resume.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      Remove
                    </button>
                  ) : (
                    <span className="text-slate-300">Base</span>
                  )}
                </div>
              )}

              {confirming && (
                <div className="space-y-2">
                  <div className="text-slate-600">
                    Remove this resume?
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRemove(resume.id)}
                      className="rounded-lg bg-red-50 px-3 py-1 text-red-600"
                    >
                      Confirm
                    </button>

                    <button
                      onClick={() => setConfirmRemoveId(null)}
                      className="rounded-lg bg-slate-100 px-3 py-1 text-slate-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ResumeUpload />
    </PanelCard>
  );
}