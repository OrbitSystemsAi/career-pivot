"use client";

import { useState } from "react";
import { styles } from "@/core/design/styles";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import {
  resumeFileAccept,
  useResumeUpload,
} from "@/modules/resume/hooks/useResumeUpload";

export default function ResumeFilters() {
  const {
    user,
    activeResumeId,
    setActiveResumeId,
    removeResume,
  } = useUser();

  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const {
    fileInputRef,
    isParsing,
    parseError,
    openResumePicker,
    handleResumeFileChange,
  } = useResumeUpload();

  function handleRemove(resumeId: string) {
    removeResume(resumeId);
    setConfirmRemoveId(null);
  }

  return (
    <PanelCard
      title="Resumes"
      titleAction={
        <button
          aria-label={isParsing ? "Parsing resume" : "Add resume"}
          className="flex h-7 w-7 items-center justify-center rounded-full text-lg leading-none text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 disabled:cursor-wait disabled:text-slate-300"
          disabled={isParsing}
          onClick={openResumePicker}
          type="button"
        >
          +
        </button>
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={resumeFileAccept}
        className="hidden"
        onChange={handleResumeFileChange}
      />

      <div className={styles.list.container}>
        {user.resumes.length === 0 && (
          <div className={`${styles.list.row} ${styles.list.rowDefault}`}>
            <span className={styles.list.rowText}>
              Please upload to get started
            </span>
          </div>
        )}

        {user.resumes.map((resume) => {
          const selected = resume.id === activeResumeId;
          const canRemove = resume.source === "upload";
          const confirming = confirmRemoveId === resume.id;

          return (
            <div
              key={resume.id}
              className={`rounded-xl px-3 py-2 text-xs transition ${
                selected ? styles.list.rowSelected : styles.list.rowDefault
              }`}
            >
              {!confirming && (
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveResumeId(resume.id)}
                    className="peer min-w-0 flex-1 truncate text-left"
                  >
                    {resume.name}
                  </button>

                  {canRemove && (
                    <button
                      onClick={() => setConfirmRemoveId(resume.id)}
                      className="shrink-0 text-slate-500 opacity-0 transition hover:opacity-100 hover:text-red-600 focus:opacity-100 peer-focus:opacity-100 peer-hover:opacity-100"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}

              {confirming && (
                <div className="space-y-2">
                  <div className="text-slate-600">Remove this resume?</div>

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

      {parseError && (
        <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-3 text-xs leading-5 text-red-600">
          {parseError}
        </div>
      )}
    </PanelCard>
  );
}
