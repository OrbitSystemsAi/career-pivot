"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useOSState } from "@/core/state/OSStateProvider";
import { useUser } from "@/core/user/UserProvider";

export default function ResumeResults() {
  const { setActiveView } = useOSState();

  const {
    user,
    activeResumeId,
    optimizeResume,
  } = useUser();

  const activeResume =
    user.resumes.find((resume) => resume.id === activeResumeId) ??
    user.resumes[0];

  function handleFullRewrite() {
    if (!activeResume) {
      return;
    }

    optimizeResume(activeResume.id, "full_rewrite");
    setActiveView("versions");
  }

  function handleViewVersions() {
    setActiveView("versions");
  }

  function handleViewDocument() {
    setActiveView("document");
  }

  return (
    <PanelCard title="Resume Actions">
      <ActionRow
        label="AI Full Rewrite"
        action="Run"
        onClick={handleFullRewrite}
      />

      <ActionRow
        label="View Versions"
        action="Open"
        onClick={handleViewVersions}
      />

      <ActionRow
        label="View Document"
        action="Open"
        onClick={handleViewDocument}
      />

      <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
        AI rewrites create a new resume version. Your existing resume history is
        preserved.
      </div>
    </PanelCard>
  );
}