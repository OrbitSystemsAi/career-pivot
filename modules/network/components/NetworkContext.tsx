import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const context = [
  {
    label: "LinkedIn Paths",
    value: "14",
  },
  {
    label: "Recruiters",
    value: "37",
  },
  {
    label: "Companies",
    value: "22",
  },
];

export default function NetworkContext() {
  return (
    <PanelCard title="Network Context">
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