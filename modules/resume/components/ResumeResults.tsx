"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const actions = [
  {
    label: "Optimize Resume",
    action: "Run",
  },
  {
    label: "Request Peer Review",
    action: "Request",
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
  return (
    <PanelCard title="Resume Actions">
      {actions.map((item) => (
        <ActionRow
          key={item.label}
          label={item.label}
          action={item.action}
        />
      ))}
    </PanelCard>
  );
}