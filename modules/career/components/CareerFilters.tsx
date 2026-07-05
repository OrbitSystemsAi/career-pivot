import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const filters = [
  {
    label: "Work Setup",
    value: "Remote",
  },
  {
    label: "Salary Range",
    value: "$150K+",
  },
  {
    label: "Target Industry",
    value: "Healthcare",
  },
];

export default function CareerFilters() {
  return (
    <PanelCard title="Career Filters">
      {filters.map((item) => (
        <ActionRow
          key={item.label}
          label={item.label}
          value={item.value}
        />
      ))}
    </PanelCard>
  );
}