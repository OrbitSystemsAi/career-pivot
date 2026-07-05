import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const words = [
  "Transformation",
  "AI Strategy",
  "Digital Operations",
];

export default function CareerWords() {
  return (
    <PanelCard title="Keywords">
      {words.map((item) => (
        <ActionRow key={item} label={item} />
      ))}
    </PanelCard>
  );
}