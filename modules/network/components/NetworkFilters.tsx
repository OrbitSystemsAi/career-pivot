import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const filters = [
  {
    label: "Relationship",
    value: "Warm",
  },
  {
    label: "Companies",
    value: "Target",
  },
  {
    label: "Recruiters",
    value: "Active",
  },
];

export default function NetworkFilters() {
  return (
    <PanelCard title="Network Filters">
      {filters.map((filter) => (
        <ActionRow
          key={filter.label}
          label={filter.label}
          value={filter.value}
        />
      ))}
    </PanelCard>
  );
}