"use client";

import { useState } from "react";
import PanelCard from "@/core/ui/PanelCard";
import ActionRow from "@/core/ui/ActionRow";
import { useOSState } from "@/core/state/OSStateProvider";
import { useUser } from "@/core/user/UserProvider";
import { getActiveResume } from "@/modules/resume/lib/resumeIntelligence";
import ResumeEmptyState from "./ResumeEmptyState";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function ResumeVersions() {
  const { setActiveView } = useOSState();

  const {
    user,
    activeResumeId,
    compareVersionId,
    setCompareVersionId,
    createResumeVersion,
    restoreResumeVersion,
    removeResumeVersion,
  } = useUser();

  const activeResume = getActiveResume(user, activeResumeId);

  const [selectedVersionId, setSelectedVersionId] = useState(
    compareVersionId || activeResume?.currentVersionId || ""
  );

  const [confirmRemoveVersionId, setConfirmRemoveVersionId] =
    useState<string | null>(null);

  if (!activeResume) {
    return <ResumeEmptyState />;
  }

  const selectedVersion =
    activeResume.versions.find((version) => version.id === selectedVersionId) ??
    activeResume.versions.find((version) => version.id === compareVersionId) ??
    activeResume.versions.find((version) => version.isCurrent) ??
    activeResume.versions[0];

  const canRemoveSelectedVersion =
    Boolean(selectedVersion) && activeResume.versions.length > 1;

  function handleSelectVersion(versionId: string) {
    setSelectedVersionId(versionId);
    setCompareVersionId(versionId);
    setConfirmRemoveVersionId(null);
  }

  function handleCreateAiVersion() {
    createResumeVersion(
      activeResume.id,
      `AI Optimized Version ${activeResume.versions.length + 1}`
    );
  }

  function handleRestoreSelected() {
    if (!selectedVersion) {
      return;
    }

    restoreResumeVersion(activeResume.id, selectedVersion.id);
  }

  function handleCompareVersions() {
    if (selectedVersion) {
      setCompareVersionId(selectedVersion.id);
    }

    setActiveView("compare");
  }

  function handleRemoveSelected() {
    if (!selectedVersion || !canRemoveSelectedVersion) {
      return;
    }

    removeResumeVersion(activeResume.id, selectedVersion.id);
    setConfirmRemoveVersionId(null);
  }

  return (
    <div className="h-full w-full overflow-auto">
      <div className="grid h-full min-h-[520px] grid-cols-[1fr_22rem] gap-4">
        <PanelCard title="Version History">
          <div className="flex flex-col gap-2">
            {activeResume.versions.map((version) => {
              const isSelected = version.id === selectedVersion?.id;

              return (
                <button
                  key={version.id}
                  onClick={() => handleSelectVersion(version.id)}
                  className={`rounded-xl border px-4 py-3 text-left text-xs ${
                    isSelected
                      ? "border-blue-200 bg-blue-50 text-blue-600"
                      : "border-slate-100 bg-white text-slate-500 hover:bg-blue-50 hover:text-blue-600"
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
                </button>
              );
            })}
          </div>
        </PanelCard>

        <PanelCard title="Version Actions">
          <ActionRow label="Selected" value={selectedVersion?.label ?? "N/A"} />

          <ActionRow
            label="Compare Versions"
            action="Open"
            onClick={handleCompareVersions}
          />

          <ActionRow
            label="Restore Selected"
            action="Restore"
            onClick={handleRestoreSelected}
          />

          <ActionRow
            label="Create AI Version"
            action="Run"
            onClick={handleCreateAiVersion}
          />

          {!confirmRemoveVersionId && (
            <ActionRow
              label="Remove Selected"
              action={canRemoveSelectedVersion ? "Remove" : "Locked"}
              onClick={
                canRemoveSelectedVersion && selectedVersion
                  ? () => setConfirmRemoveVersionId(selectedVersion.id)
                  : undefined
              }
            />
          )}

          {confirmRemoveVersionId && (
            <div className="mt-2 rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-600">
              <div className="font-semibold">Remove selected version?</div>

              <div className="mt-2 flex gap-2">
                <button
                  onClick={handleRemoveSelected}
                  className="rounded-lg bg-white px-3 py-1 text-red-600"
                >
                  Confirm
                </button>

                <button
                  onClick={() => setConfirmRemoveVersionId(null)}
                  className="rounded-lg bg-white px-3 py-1 text-slate-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <ActionRow label="Export Current" action="Export" />

          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
            You can remove saved versions, but each resume must keep at least
            one version. If the current version is removed, OSai selects the most
            recent remaining version.
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
