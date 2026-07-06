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
  const { user, activeResumeId } = useUser();

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
    activeResume.versions
      .filter((version) => version.id !== currentVersion?.id)
      .at(-1) ?? activeResume.versions[0];

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

          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <p>
              This version is currently active and powers the Resume Document
              view.
            </p>

            <p>
              Future comparison logic will highlight wording changes, keyword
              improvements, ATS score movement, and target-role alignment.
            </p>
          </div>
        </PanelCard>

        <PanelCard title="Compare Against">
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
            <ActionRow label="Summary improved" value="+12%" />
            <ActionRow label="Keyword match" value="+8%" />
            <ActionRow label="Executive tone" value="Higher" />
            <ActionRow label="Healthcare alignment" value="Improved" />
          </div>
        </PanelCard>
      </div>
    </div>
  );
}