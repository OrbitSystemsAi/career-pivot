import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const results = [
  {
    label: "ATS Score",
    value: "84%",
  },
  {
    label: "Keyword Match",
    value: "76%",
  },
  {
    label: "Executive Alignment",
    value: "High",
  },
];

export default function ResumeResults() {
  return (
    <PanelCard title="Resume Results">
      {results.map((item) => (
        <ActionRow
          key={item.label}
          label={item.label}
          value={item.value}
        />
      ))}
    </PanelCard>
  );
}