import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const items = [
  "AI leadership demand increasing",
  "Healthcare transformation expanding",
  "Remote executive roles competitive",
];

export default function CareerMarketContext() {
  return (
    <PanelCard title="Market Intelligence">
      {items.map((item) => (
        <ActionRow key={item} label={item} />
      ))}
    </PanelCard>
  );
}