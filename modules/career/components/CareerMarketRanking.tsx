import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const companies = [
  {
    label: "Optum",
    value: "92%",
  },
  {
    label: "Humana",
    value: "87%",
  },
  {
    label: "Salesforce Health",
    value: "81%",
  },
];

export default function CareerMarketRanking() {
  return (
    <PanelCard title="Company Fit">
      {companies.map((company) => (
        <ActionRow
          key={company.label}
          label={company.label}
          value={company.value}
        />
      ))}
    </PanelCard>
  );
}