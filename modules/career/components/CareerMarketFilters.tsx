import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const filters = [
  "Remote",
  "Hybrid",
  "$150K+",
  "Healthcare",
];

export default function CareerMarketFilters() {
  return (
    <PanelCard title="Market Filters">
      {filters.map((filter) => (
        <ActionRow key={filter} label={filter} />
      ))}
    </PanelCard>
  );
}