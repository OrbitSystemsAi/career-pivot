import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const strengths = [
  "Finance leadership",
  "Business intelligence",
  "Enterprise systems",
];

export default function CareerStrengths() {
  return (
    <PanelCard title="Strengths">
      {strengths.map((item) => (
        <ActionRow key={item} label={item} />
      ))}
    </PanelCard>
  );
}