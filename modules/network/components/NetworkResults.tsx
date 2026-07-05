import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const results = [
  {
    label: "Warm Connections",
    value: "14",
  },
  {
    label: "Referral Paths",
    value: "8",
  },
  {
    label: "Outreach Ready",
    value: "5",
  },
];

export default function NetworkResults() {
  return (
    <PanelCard title="Network Results">
      {results.map((result) => (
        <ActionRow
          key={result.label}
          label={result.label}
          value={result.value}
        />
      ))}
    </PanelCard>
  );
}