import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const filters = [
  "Executive",
  "AI Transformation",
  "Remote",
  "Healthcare",
];

export default function ResumeFilters() {
  return (
    <PanelCard title="Resume Filters">
      {filters.map((item) => (
        <ActionRow key={item} label={item} />
      ))}
    </PanelCard>
  );
}