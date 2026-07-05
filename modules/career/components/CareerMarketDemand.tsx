import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const demand = [
  {
    label: "AI Transformation",
    value: "High",
  },
  {
    label: "Healthcare Technology",
    value: "High",
  },
  {
    label: "Finance Operations",
    value: "Medium",
  },
];

export default function CareerMarketDemand() {
  return (
    <PanelCard title="Market Demand">
      {demand.map((item) => (
        <ActionRow
          key={item.label}
          label={item.label}
          value={item.value}
        />
      ))}
    </PanelCard>
  );
}