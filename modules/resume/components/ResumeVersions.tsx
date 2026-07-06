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

export default function ResumeVersions() {
  const { user, activeResumeId, createResumeVersion } = useUser();

  const activeResume =
    user.resumes.find((resume) => resume.id === activeResumeId) ??
    user.resumes[0];

  if (!activeResume) {
    return (
      <PanelCard title="Resume Versions">
        <ActionRow label="No resume selected" value="N/A" />
      </PanelCard>
    );
  }

  function handleCreateAiVersion() {
    createResumeVersion(
      activeResume.id,
      `AI Optimized Version ${activeResume.versions.length + 1}`
    );
  }

  return (
    <div className="h-full w-full overflow-auto">
      <div className="grid h-full min-h-[520px] grid-cols-[1fr_22rem] gap-4">
        <PanelCard title="Version History">
          <div className="flex flex-col gap-2">
            {activeResume.versions.map((version) => (
              <div
                key={version.id}
                className={`rounded-xl border px-4 py-3 text-xs ${
                  version.isCurrent
                    ? "border-blue-200 bg-blue-50 text-blue-600"
                    : "border-slate-100 bg-white text-slate-500"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">{version.label}</div>
                  <div>{version.isCurrent ? "Current" : "Saved"}</div>
                </div>

                <div className="mt-2 flex items-center justify-between text-slate-400">
                  <span>{version.source}</span>
                  <span>{formatDate(version.createdDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </PanelCard>

        <PanelCard title="Version Actions">
          <ActionRow label="Compare Versions" action="Open" />
          <ActionRow label="Restore Selected" action="Restore" />
          <ActionRow
            label="Create AI Version"
            action="Run"
            onClick={handleCreateAiVersion}
          />
          <ActionRow label="Export Current" action="Export" />

          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
            Resume optimization creates a new version instead of overwriting the
            current document.
          </div>
        </PanelCard>
      </div>
    </div>
  );
}