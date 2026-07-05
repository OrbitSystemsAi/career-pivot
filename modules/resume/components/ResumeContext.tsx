import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const context = [
  {
    label: "Target Role",
    value: "Director+",
  },
  {
    label: "Industry",
    value: "Healthcare",
  },
  {
    label: "Focus",
    value: "AI",
  },
];

export default function ResumeContext() {
  return (
    <PanelCard title="Resume Context">
      {context.map((item) => (
        <ActionRow
          key={item.label}
          label={item.label}
          value={item.value}
        />
      ))}
    </PanelCard>
  );
}