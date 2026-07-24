"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useOSState } from "@/core/state/OSStateProvider";
import { useUser } from "@/core/user/UserProvider";
import { getResumeIntelligence } from "@/modules/resume/lib/resumeIntelligence";
import ResumeEmptyState from "./ResumeEmptyState";

function getReadiness(score: number) {
  if (score >= 85) {
    return "High";
  }

  if (score >= 70) {
    return "Moderate";
  }

  return "Developing";
}

export default function ResumeModule() {
  const { setActiveView } = useOSState();
  const { user, activeResumeId, optimizeResume } = useUser();

  const intelligence = getResumeIntelligence(user, activeResumeId);
  const {
    activeResume,
    activeVersion,
    skillCount,
    experienceCount,
    analysis,
  } = intelligence;

  if (!activeResume) {
    return <ResumeEmptyState />;
  }

  function handleOptimize() {
    optimizeResume(activeResume.id, "full_rewrite");
    setActiveView("versions");
  }

  return (
    <div className="grid h-full min-h-[520px] grid-cols-[1fr_22rem] gap-4 overflow-auto">
      <PanelCard title="Resume Intelligence Summary">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-3xl text-slate-900">
              {analysis.resumeQualityScore}%
            </div>

            <div className="mt-2 text-xs text-slate-500">
              Resume Quality
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-3xl text-slate-900">
              {analysis.current.overallScore}%
            </div>

            <div className="mt-2 text-xs text-slate-500">
              Current Role Match
            </div>

            <div className="mt-1 truncate text-xs text-slate-400">
              {analysis.current.role.title}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-100 p-5">
            <div className="text-3xl text-slate-900">
              {analysis.target.overallScore}%
            </div>

            <div className="mt-2 text-xs text-slate-500">
              Target Role Match
            </div>

            <div className="mt-1 truncate text-xs text-slate-400">
              {analysis.target.role.title}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-3xl text-slate-900">
              {analysis.issueCount}
            </div>

            <div className="mt-2 text-xs text-slate-500">
              Issues
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Current Positioning
            </div>

            <div className="mt-2 text-sm text-slate-700">
              {analysis.current.role.title}
            </div>

            <div className="mt-3 text-xs text-slate-500">
              Readiness: {getReadiness(analysis.current.overallScore)}
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Target Positioning
            </div>

            <div className="mt-2 text-sm text-slate-700">
              {analysis.target.role.title}
            </div>

            <div className="mt-3 text-xs text-slate-500">
              Readiness: {getReadiness(analysis.target.overallScore)}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-400">
            Active Resume
          </div>

          <div className="mt-2 text-sm text-slate-700">
            {activeResume.name}
          </div>

          <div className="mt-1 text-xs text-slate-500">
            Current version: {activeVersion?.label ?? "No version selected"}
          </div>
        </div>
      </PanelCard>

      <PanelCard title="Recommendations">
        <ActionRow
          label="Detected Skills"
          value={String(skillCount)}
        />

        <ActionRow
          label="Experience Sections"
          value={String(experienceCount)}
        />

        <ActionRow
          label="Parser Confidence"
          value={`${analysis.parserConfidence}%`}
        />

        <ActionRow
          label="Target ATS"
          value={`${analysis.target.atsScore}%`}
        />

        <div className="mt-4 border-t border-slate-100 pt-4">
          {analysis.target.recommendations.map((recommendation) => (
            <div
              key={recommendation}
              className="mb-3 text-xs leading-5 text-slate-500"
            >
              {recommendation}
            </div>
          ))}
        </div>

        <ActionRow
          label="Create Optimized Version"
          action="Run"
          onClick={handleOptimize}
        />
      </PanelCard>
    </div>
  );
}