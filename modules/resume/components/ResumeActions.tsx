"use client";

import { useState } from "react";
import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useOSState } from "@/core/state/OSStateProvider";
import { useUser } from "@/core/user/UserProvider";
import ResumePeerReview from "./ResumePeerReview";
import ResumeParserDebug from "./ResumeParserDebug";

export default function ResumeActions() {
  const { setActiveView } = useOSState();

  const { user, activeResumeId, optimizeResume } = useUser();

  const [activePanel, setActivePanel] =
    useState<"actions" | "review" | "debug">("actions");

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

  if (activePanel === "review") {
    return (
      <ResumePeerReview
        onBack={() => setActivePanel("actions")}
      />
    );
  }

  if (activePanel === "debug") {
    return (
      <div>
        <ActionRow
          label="Back to Actions"
          action="Back"
          onClick={() => setActivePanel("actions")}
        />

        <ResumeParserDebug />
      </div>
    );
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
        onClick={() => setActivePanel("review")}
      />

      <ActionRow
        label="Parser Debug"
        action="Open"
        onClick={() => setActivePanel("debug")}
      />
    </PanelCard>
  );
}