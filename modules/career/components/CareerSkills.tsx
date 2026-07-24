"use client";

import { useUser } from "@/core/user/UserProvider";
import { getCareerIntelligence } from "@/modules/career/lib/careerIntelligence";
import {
  resumeFileAccept,
  useResumeUpload,
} from "@/modules/resume/hooks/useResumeUpload";

export default function CareerSkills() {
  const { user, activeResumeId } = useUser();
  const career = getCareerIntelligence(user, activeResumeId);
  const {
    fileInputRef,
    isParsing,
    parseError,
    openResumePicker,
    handleResumeFileChange,
  } = useResumeUpload();

  if (!career.hasResume) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white p-8">
        <section className="flex min-h-[325px] w-full max-w-3xl flex-col items-center rounded-3xl border border-[#c8dfe9] bg-[linear-gradient(145deg,#f8fcfe,#e3f3f9)] px-10 pt-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#173a46] text-xl text-white">
            ✦
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[#102f39]">
            Skills intelligence needs career evidence
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Upload a resume to identify demonstrated skills, transferable
            strengths, and gaps against your target direction.
          </p>
          <div className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-[#2b6874]">
            This view builds your skills profile from resume evidence
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={resumeFileAccept}
            className="hidden"
            onChange={handleResumeFileChange}
          />
          <div className="flex flex-1 flex-col items-center justify-center">
            {parseError ? (
              <div className="mb-3 text-xs text-red-600">{parseError}</div>
            ) : null}
            <button
              type="button"
              onClick={openResumePicker}
              disabled={isParsing}
              className="rounded-xl bg-[#164858] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#f28c28] disabled:cursor-wait disabled:opacity-60"
            >
              {isParsing ? "Uploading Resume..." : "Upload Resume"}
            </button>
          </div>
        </section>
      </div>
    );
  }

  const skills = career.skills.slice(0, 8);

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="w-full max-w-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 text-xs font-semibold uppercase text-slate-400">
          Career Skills
        </div>

        <div className="flex flex-col gap-2">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <div
                key={skill}
                className="flex justify-between px-4 py-3 text-xs font-medium text-slate-500 hover:bg-blue-50"
              >
                <span>{skill}</span>
                <span className="text-emerald-600">resume</span>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-xs text-slate-500">
              Skills will appear as resume parsing improves.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
