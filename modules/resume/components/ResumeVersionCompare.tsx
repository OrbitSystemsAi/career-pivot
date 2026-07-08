"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function ResumeVersionCompare() {
  const { user, activeResumeId, compareVersionId } = useUser();

  const activeResume =
    user.resumes.find((resume) => resume.id === activeResumeId) ??
    user.resumes[0];

  if (!activeResume) {
    return (
      <PanelCard title="Compare Versions">
        <ActionRow label="No resume selected" value="N/A" />
      </PanelCard>
    );
  }

  const currentVersion =
    activeResume.versions.find(
      (version) => version.id === activeResume.currentVersionId
    ) ?? activeResume.versions[0];

  const comparisonVersion =
    activeResume.versions.find((version) => version.id === compareVersionId) ??
    activeResume.versions.find((version) => version.id !== currentVersion?.id) ??
    activeResume.versions[0];

  const currentOptimization =
    currentVersion?.parsedDocument?.optimizationSummary;

  const comparisonOptimization =
    comparisonVersion?.parsedDocument?.optimizationSummary;

  return (
    <div className="h-full w-full overflow-auto">
      <div className="grid h-full min-h-[520px] grid-cols-2 gap-4">
        <PanelCard title="Current Version">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs text-blue-600">
            <div className="font-semibold">{currentVersion?.label}</div>
            <div className="mt-2 text-blue-500">
              {currentVersion?.source} ·{" "}
              {currentVersion?.createdDate
                ? formatDate(currentVersion.createdDate)
                : "No date"}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <ActionRow
              label="Optimization"
              value={currentOptimization?.type ?? "None"}
            />

            <ActionRow
              label="Raw Lines"
              value={String(currentVersion?.parsedDocument?.lines.length ?? 0)}
            />

            <ActionRow
              label="Skills"
              value={String(
                currentVersion?.parsedDocument?.structuredResume?.skills.length ??
                  0
              )}
            />

            <ActionRow
              label="Experience"
              value={String(
                currentVersion?.parsedDocument?.structuredResume?.experience
                  .length ?? 0
              )}
            />
          </div>

          {currentOptimization && (
            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-blue-700">
              <div className="font-semibold">{currentOptimization.label}</div>

              <ul className="mt-2 list-disc space-y-1 pl-5">
                {currentOptimization.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </PanelCard>

        <PanelCard title="Selected Comparison">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
            <div className="font-semibold text-slate-700">
              {comparisonVersion?.label}
            </div>
            <div className="mt-2 text-slate-400">
              {comparisonVersion?.source} ·{" "}
              {comparisonVersion?.createdDate
                ? formatDate(comparisonVersion.createdDate)
                : "No date"}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <ActionRow
              label="Optimization"
              value={comparisonOptimization?.type ?? "None"}
            />

            <ActionRow
              label="Raw Lines"
              value={String(
                comparisonVersion?.parsedDocument?.lines.length ?? 0
              )}
            />

            <ActionRow
              label="Skills"
              value={String(
                comparisonVersion?.parsedDocument?.structuredResume?.skills
                  .length ?? 0
              )}
            />

            <ActionRow
              label="Experience"
              value={String(
                comparisonVersion?.parsedDocument?.structuredResume?.experience
                  .length ?? 0
              )}
            />
          </div>

          {comparisonOptimization && (
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs leading-5 text-slate-600">
              <div className="font-semibold">{comparisonOptimization.label}</div>

              <ul className="mt-2 list-disc space-y-1 pl-5">
                {comparisonOptimization.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </PanelCard>
      </div>
    </div>
  );
}