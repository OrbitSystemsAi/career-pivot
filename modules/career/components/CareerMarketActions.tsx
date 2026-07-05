import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const actions = [
  "Optimize LinkedIn",
  "Generate outreach",
  "Create target list",
];

export default function CareerMarketActions() {
  return (
    <PanelCard title="Actions">
      {actions.map((item) => (
        <ActionRow
          key={item}
          label={item}
          action="Run"
        />
      ))}
    </PanelCard>
  );
}