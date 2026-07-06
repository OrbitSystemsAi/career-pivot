"use client";

import { useState } from "react";
import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import ResumePeerReview from "./ResumePeerReview";

const actions = [
  {
    label: "Optimize Resume",
    action: "Run",
  },
  {
    label: "Compare Versions",
    action: "Open",
  },
  {
    label: "Export Word",
    action: "Export",
  },
];

export default function ResumeResults() {
  const [showPeerReview, setShowPeerReview] = useState(false);

  if (showPeerReview) {
    return <ResumePeerReview />;
  }

  return (
    <PanelCard title="Resume Actions">
      {actions.map((item) => (
        <ActionRow
          key={item.label}
          label={item.label}
          action={item.action}
        />
      ))}

      <button
        onClick={() => setShowPeerReview(true)}
        className="flex w-full justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
      >
        <span>Request Peer Review</span>
        <span className="text-blue-600">Request</span>
      </button>
    </PanelCard>
  );
}