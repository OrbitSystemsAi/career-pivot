import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const suggestions = [
  "Increase AI transformation positioning",
  "Highlight enterprise ownership",
  "Expand executive storytelling",
];

export default function CareerSuggestions() {
  return (
    <PanelCard title="Suggestions">
      {suggestions.map((item) => (
        <ActionRow key={item} label={item} />
      ))}
    </PanelCard>
  );
}