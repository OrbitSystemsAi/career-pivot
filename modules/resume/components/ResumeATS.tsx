"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getResumeIntelligence } from "@/modules/resume/lib/resumeIntelligence";
import ResumeEmptyState from "./ResumeEmptyState";

export default function ResumeATS() {
  const { user, activeResumeId, optimizeResume } = useUser();
  const intelligence = getResumeIntelligence(user, activeResumeId);
  const { activeResume, analysis } = intelligence;

  if (!activeResume) {
    return <ResumeEmptyState />;
  }

  const current = analysis.current;
  const target = analysis.target;

  function handleOptimizeATS() {
    optimizeResume(activeResume.id, "ats");
  }

  return (
    <div className="h-full w-full overflow-auto">
      <div className="grid h-full min-h-[520px] grid-cols-[1fr_22rem] gap-4">
        <PanelCard title="ATS Alignment">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-4xl text-slate-900">
                {current.atsScore}%
              </div>

              <div className="mt-2 text-sm text-slate-700">
                Current Role ATS Score
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {current.role.title}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-100 p-6">
              <div className="text-4xl text-slate-900">
                {target.atsScore}%
              </div>

              <div className="mt-2 text-sm text-slate-700">
                Target Role ATS Score
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {target.role.title}
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">
                Current Role
              </div>

              <ActionRow
                label="Title Alignment"
                value={`${current.titleAlignment}%`}
              />
              <ActionRow
                label="Keyword Coverage"
                value={`${current.keywordCoverage}%`}
              />
              <ActionRow
                label="Experience Alignment"
                value={`${current.experienceAlignment}%`}
              />
              <ActionRow
                label="Skills Alignment"
                value={`${current.skillsAlignment}%`}
              />
              <ActionRow
                label="Leadership"
                value={`${current.leadershipAlignment}%`}
              />
              <ActionRow
                label="Industry Alignment"
                value={`${current.industryAlignment}%`}
              />
            </div>

            <div>
              <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">
                Target Role
              </div>

              <ActionRow
                label="Title Alignment"
                value={`${target.titleAlignment}%`}
              />
              <ActionRow
                label="Keyword Coverage"
                value={`${target.keywordCoverage}%`}
              />
              <ActionRow
                label="Experience Alignment"
                value={`${target.experienceAlignment}%`}
              />
              <ActionRow
                label="Skills Alignment"
                value={`${target.skillsAlignment}%`}
              />
              <ActionRow
                label="Leadership"
                value={`${target.leadershipAlignment}%`}
              />
              <ActionRow
                label="Industry Alignment"
                value={`${target.industryAlignment}%`}
              />
            </div>
          </div>
        </PanelCard>

        <PanelCard title="ATS Improvements">
          <div className="mb-3 text-xs leading-5 text-slate-500">
            Improvements are based on the selected target role.
          </div>

          <div className="space-y-1">
            {!analysis.hasTarget ? (
              <ActionRow
                label="Select a target role to calculate ATS improvements"
                value="0"
              />
            ) : target.missingKeywords.length === 0 ? (
              <ActionRow label="No major keyword gaps" value="Good" />
            ) : (
              target.missingKeywords.map((keyword) => (
                <ActionRow
                  key={keyword}
                  label={keyword}
                  action="Add"
                />
              ))
            )}
          </div>

          {analysis.hasTarget ? (
            <div className="mt-4 border-t border-slate-100 pt-4">
              {target.recommendations.map((recommendation) => (
                <div
                  key={recommendation}
                  className="mb-2 text-xs leading-5 text-slate-500"
                >
                  {recommendation}
                </div>
              ))}
            </div>
          ) : null}

          {analysis.hasTarget ? (
            <div className="mt-4">
              <ActionRow
                label="Create ATS Optimized Version"
                action="Run"
                onClick={handleOptimizeATS}
              />
            </div>
          ) : null}
        </PanelCard>
      </div>
    </div>
  );
}
