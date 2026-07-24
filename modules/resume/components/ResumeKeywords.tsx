"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getResumeIntelligence } from "@/modules/resume/lib/resumeIntelligence";
import ResumeEmptyState from "./ResumeEmptyState";

export default function ResumeKeywords() {
  const { user, activeResumeId, optimizeResume } = useUser();
  const intelligence = getResumeIntelligence(user, activeResumeId);
  const { activeResume, analysis } = intelligence;

  if (!activeResume) {
    return <ResumeEmptyState />;
  }

  function handleOptimizeKeywords() {
    optimizeResume(activeResume.id, "keywords");
  }

  return (
    <div className="h-full w-full overflow-auto">
      <div className="grid h-full min-h-[520px] grid-cols-2 gap-4">
        <PanelCard title="Current Role Keywords">
          <div className="mb-3 text-xs leading-5 text-slate-500">
            Keyword coverage for {analysis.current.role.title}:{" "}
            {analysis.current.keywordCoverage}%.
          </div>

          <div className="space-y-1">
            {analysis.current.detectedKeywords.length === 0 ? (
              <ActionRow label="No keywords detected" value="0" />
            ) : (
              analysis.current.detectedKeywords.map((keyword) => (
                <ActionRow
                  key={keyword}
                  label={keyword}
                  value="Detected"
                />
              ))
            )}
          </div>

          {analysis.current.missingKeywords.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">
                Current Role Gaps
              </div>

              {analysis.current.missingKeywords.map((keyword) => (
                <ActionRow
                  key={keyword}
                  label={keyword}
                  value="Missing"
                />
              ))}
            </div>
          )}
        </PanelCard>

        <PanelCard title="Target Role Keywords">
          <div className="mb-3 text-xs leading-5 text-slate-500">
            Keyword coverage for {analysis.target.role.title}:{" "}
            {analysis.target.keywordCoverage}%.
          </div>

          <div className="space-y-1">
            {analysis.target.detectedKeywords.length === 0 ? (
              <ActionRow label="No target keywords detected" value="0" />
            ) : (
              analysis.target.detectedKeywords.map((keyword) => (
                <ActionRow
                  key={keyword}
                  label={keyword}
                  value="Detected"
                />
              ))
            )}
          </div>

          {analysis.target.missingKeywords.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">
                Target Role Opportunities
              </div>

              {analysis.target.missingKeywords.map((keyword) => (
                <ActionRow
                  key={keyword}
                  label={keyword}
                  value="Missing"
                />
              ))}
            </div>
          )}

          <div className="mt-4">
            <ActionRow
              label="Create Keyword Optimized Version"
              action="Run"
              onClick={handleOptimizeKeywords}
            />
          </div>
        </PanelCard>
      </div>
    </div>
  );
}