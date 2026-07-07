"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useOSState } from "@/core/state/OSStateProvider";
import { useUser } from "@/core/user/UserProvider";

export default function ResumeActions() {
  const { setActiveView } = useOSState();
  const { user, activeResumeId, optimizeResume } = useUser();

  const activeResume =
    user.resumes.find((resume) => resume.id === activeResumeId) ??
    user.resumes[0];

  function handleOptimize() {
    if (!activeResume) {
      return;
    }

    optimizeResume(activeResume.id, "full_rewrite");
    setActiveView("versions");
  }

  return (
    <PanelCard title="Actions">
      <ActionRow
        label="Optimize Resume"
        action="Run"
        onClick={handleOptimize}
      />

      <ActionRow
        label="Review Document"
        action="Open"
        onClick={() => setActiveView("document")}
      />

      <ActionRow
        label="Compare Versions"
        action="Open"
        onClick={() => setActiveView("compare")}
      />

      <ActionRow
        label="Request Peer Review"
        action="Request"
        onClick={() => setActiveView("summary")}
      />
    </PanelCard>
  );
}