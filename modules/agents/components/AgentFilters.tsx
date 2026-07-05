import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const filters = ["Active", "Paused", "Scheduled"];

export default function AgentFilters() {
  return (
    <PanelCard title="Agent Filters">
      {filters.map((item) => (
        <ActionRow key={item} label={item} />
      ))}
    </PanelCard>
  );
}