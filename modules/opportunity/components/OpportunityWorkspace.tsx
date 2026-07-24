"use client";

import { useMemo, useState } from "react";
import { getCareerOpportunityIntelligence } from "@/core/opportunities/careerOpportunityEngine";
import type { OpportunityScore } from "@/core/opportunities/opportunityTypes";
import { useOSState } from "@/core/state/OSStateProvider";
import { useUser } from "@/core/user/UserProvider";
import {
  resumeFileAccept,
  useResumeUpload,
} from "@/modules/resume/hooks/useResumeUpload";

function scoreColor(value: number) {
  if (value >= 85) return "#168391";
  if (value >= 70) return "#35afe6";
  return "#f28c28";
}

function ScoreRow({ score }: { score: OpportunityScore }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 text-xs">
        <span className="font-medium text-[#173a46]">{score.label}</span>
        <span className="font-semibold text-[#173a46]">
          {score.value === null ? "Not evidenced" : `${score.value}%`}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8f2f3]">
        {score.value !== null ? (
          <div
            className="h-full rounded-full transition-[width] duration-300"
            style={{
              width: `${score.value}%`,
              backgroundColor: scoreColor(score.value),
            }}
          />
        ) : null}
      </div>
      <p className="mt-1.5 text-[11px] leading-4 text-slate-500">
        {score.explanation}
      </p>
    </div>
  );
}

export default function OpportunityWorkspace() {
  const {
    user,
    activeResumeId,
    updateOpportunityProgress,
  } = useUser();
  const { setActiveModule, setActiveView } = useOSState();
  const {
    fileInputRef,
    isParsing,
    parseError,
    openResumePicker,
    handleResumeFileChange,
  } = useResumeUpload();
  const intelligence = useMemo(
    () => getCareerOpportunityIntelligence(user, activeResumeId),
    [user, activeResumeId]
  );
  const [selectedPathId, setSelectedPathId] = useState(
    intelligence.paths[0]?.id ?? ""
  );
  const [selectedJobId, setSelectedJobId] = useState("");

  if (!intelligence.isReady) {
    const completedCount = intelligence.prerequisites.filter(
      (requirement) => requirement.complete
    ).length;

    function openRequirement(key: "goal" | "paths" | "resume") {
      if (key === "resume") {
        openResumePicker();
        return;
      }

      setActiveModule("career");
      setActiveView(key === "goal" ? "goal" : "market");
    }

    return (
      <div className="flex h-full w-full items-center justify-center bg-white p-8">
        <section className="flex min-h-[360px] w-full max-w-3xl flex-col items-center justify-center rounded-3xl border border-[#c8dfe9] bg-[linear-gradient(145deg,#f8fcfe,#e3f3f9)] px-10 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#173a46] text-xl text-white">
            ◎
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[#102f39]">
            Complete your Opportunity setup
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Opportunity needs your Career Goals, Career Paths, and resume before
            it can group jobs and calculate evidence-backed fit scores.
          </p>
          <div className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#2b6874]">
            {completedCount} of 3 complete
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={resumeFileAccept}
            className="hidden"
            onChange={handleResumeFileChange}
          />

          {parseError ? (
            <div className="mt-4 text-xs text-red-600">{parseError}</div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {intelligence.prerequisites
              .filter((requirement) => !requirement.complete)
              .map((requirement) => (
                <button
                  key={requirement.key}
                  type="button"
                  onClick={() => openRequirement(requirement.key)}
                  disabled={requirement.key === "resume" && isParsing}
                  className="min-w-40 rounded-xl bg-[#164858] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#f28c28] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168391] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
                >
                  {requirement.key === "resume" && isParsing
                    ? "Uploading Resume..."
                    : requirement.label}
                </button>
              ))}
          </div>
        </section>
      </div>
    );
  }

  const selectedPath =
    intelligence.paths.find((path) => path.id === selectedPathId) ??
    intelligence.paths[0];
  const visibleJobs = selectedPath.jobs.filter(
    (job) =>
      !user.opportunityProgress.dismissedOpportunityIds.includes(job.id)
  );
  const selectedJob =
    visibleJobs.find((job) => job.id === selectedJobId) ?? visibleJobs[0];

  function toggleSaved(jobId: string) {
    const saved = user.opportunityProgress.savedOpportunityIds.includes(jobId);
    updateOpportunityProgress({
      ...user.opportunityProgress,
      savedOpportunityIds: saved
        ? user.opportunityProgress.savedOpportunityIds.filter(
            (id) => id !== jobId
          )
        : [...user.opportunityProgress.savedOpportunityIds, jobId],
    });
  }

  function dismiss(jobId: string) {
    updateOpportunityProgress({
      savedOpportunityIds:
        user.opportunityProgress.savedOpportunityIds.filter(
          (id) => id !== jobId
        ),
      dismissedOpportunityIds: [
        ...user.opportunityProgress.dismissedOpportunityIds,
        jobId,
      ],
    });
  }

  return (
    <div className="h-full overflow-hidden bg-white p-4 text-[#173a46]">
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-[#c8dfe9] bg-white shadow-sm">
        <header className="border-b border-[#c8dfe9] bg-[linear-gradient(135deg,#102f39,#2b6874)] px-6 py-5 text-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Opportunity paths
              </h2>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-[#d3e1e4]">
                Jobs are grouped by your Career selections. Scores use only
                the evidence currently available in your profile and resume.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold">
                {intelligence.totalJobs}
              </div>
              <div className="text-xs text-[#d3e1e4]">
                jobs across {intelligence.paths.length} path
                {intelligence.paths.length === 1 ? "" : "s"}
              </div>
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {intelligence.paths.map((path) => {
              const selected = path.id === selectedPath.id;
              return (
                <button
                  key={path.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setSelectedPathId(path.id);
                    setSelectedJobId("");
                  }}
                  className={`min-w-[210px] rounded-xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb25c] ${
                    selected
                      ? "border-[#f28c28] bg-white text-[#102f39]"
                      : "border-white/20 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  <span className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${selected ? "text-[#2b6874]" : "text-[#b9d0d5]"}`}>
                    Career choice {path.choiceNumber}
                  </span>
                  <span className="mt-1 block text-xs font-semibold">
                    {path.label}
                  </span>
                  <span className={`mt-1 block text-[11px] ${selected ? "text-slate-500" : "text-[#b9d0d5]"}`}>
                    {path.jobs.length} matched jobs
                  </span>
                </button>
              );
            })}
          </div>
        </header>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(285px,0.82fr)_minmax(440px,1.18fr)]">
          <section className="min-h-0 overflow-y-auto border-r border-[#c8dfe9] bg-[#f8fcfe] p-4">
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2b6874]">
                  Selected path
                </div>
                <h3 className="mt-1 text-sm font-semibold">
                  {selectedPath.label}
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                {visibleJobs.length} visible
              </span>
            </div>

            <div className="space-y-2">
              {visibleJobs.map((job) => {
                const active = job.id === selectedJob?.id;
                const saved =
                  user.opportunityProgress.savedOpportunityIds.includes(job.id);
                return (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => setSelectedJobId(job.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168391] ${
                      active
                        ? "border-[#168391] bg-white shadow-[inset_4px_0_0_#f28c28]"
                        : "border-[#d6e8ea] bg-white/80 hover:border-[#69c8e8]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#102f39]">
                          {job.title}
                        </div>
                        <div className="mt-1 truncate text-xs text-slate-500">
                          {job.organization}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-lg font-semibold text-[#126174]">
                          {job.overallScore}%
                        </div>
                        <div className="text-[10px] uppercase tracking-wide text-slate-400">
                          overall
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-slate-500">
                      <span>{job.workMode}</span>
                      <span>{job.salary}</span>
                      {saved ? <span className="font-semibold text-[#f28c28]">Saved</span> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {selectedJob ? (
            <article className="min-h-0 overflow-y-auto p-6 lg:p-7">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="max-w-xl">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2b6874]">
                    {selectedPath.label}
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#102f39]">
                    {selectedJob.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {selectedJob.organization} · {selectedJob.location}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>{selectedJob.employmentType}</span>
                    <span>{selectedJob.workMode}</span>
                    <span>{selectedJob.salary}</span>
                    <span>{selectedJob.postedLabel}</span>
                  </div>
                </div>
                <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-8 border-[#dff5fb] bg-white shadow-sm">
                  <div className="text-2xl font-semibold text-[#126174]">
                    {selectedJob.overallScore}%
                  </div>
                  <div className="text-[9px] uppercase tracking-wide text-slate-400">
                    overall fit
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-[#fff3e7] px-4 py-3 text-xs text-[#8a531c]">
                <span>
                  {selectedJob.evidenceCoverage}/5 score areas have evidence
                </span>
                <span className="font-semibold">{selectedJob.sourceLabel}</span>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-600">
                {selectedJob.description}
              </p>

              <section className="mt-6 rounded-2xl border border-[#c8dfe9] bg-[#f8fcfe] p-5">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-sm font-semibold text-[#102f39]">
                    Score breakdown
                  </h4>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
                    Evidence-backed
                  </span>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {selectedJob.scores.map((score) => (
                    <ScoreRow key={score.key} score={score} />
                  ))}
                </div>
              </section>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <section className="rounded-2xl bg-[#e8f2f3] p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2b6874]">
                    Why it fits
                  </h4>
                  <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-600">
                    {selectedJob.fitReasons.map((reason) => (
                      <li key={reason}>• {reason}</li>
                    ))}
                  </ul>
                </section>
                <section className="rounded-2xl bg-[#fff3e7] p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a531c]">
                    Evidence to strengthen
                  </h4>
                  {selectedJob.gaps.length ? (
                    <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-600">
                      {selectedJob.gaps.map((gap) => (
                        <li key={gap}>• {gap}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-xs leading-5 text-slate-600">
                      All score areas currently have supporting evidence.
                    </p>
                  )}
                </section>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-[#d6e8ea] pt-5">
                <button
                  type="button"
                  onClick={() => toggleSaved(selectedJob.id)}
                  className="rounded-xl bg-[#164858] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#f28c28]"
                >
                  {user.opportunityProgress.savedOpportunityIds.includes(
                    selectedJob.id
                  )
                    ? "Remove from Shortlist"
                    : "Save to Shortlist"}
                </button>
                <button
                  type="button"
                  onClick={() => dismiss(selectedJob.id)}
                  className="rounded-xl border border-[#c8dfe9] px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-[#f3f8f8]"
                >
                  Not Relevant
                </button>
              </div>
            </article>
          ) : (
            <div className="flex items-center justify-center p-8 text-center text-sm text-slate-500">
              No visible jobs remain in this career path.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
