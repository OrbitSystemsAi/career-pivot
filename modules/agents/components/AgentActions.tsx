import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const actions = [
  "Create new agent",
  "Schedule scan",
  "Review recommendations",
];

export default function AgentActions() {
  return (
    <PanelCard title="Actions">
      {actions.map((item) => (
        <ActionRow key={item} label={item} action="Open" />
      ))}
    </PanelCard>
  );
}