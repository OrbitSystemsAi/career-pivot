import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const companies = [
  {
    label: "Microsoft",
    value: "18",
  },
  {
    label: "Amazon",
    value: "14",
  },
  {
    label: "UnitedHealth",
    value: "11",
  },
  {
    label: "Salesforce",
    value: "9",
  },
];

export default function CareerCompanies() {
  return (
    <PanelCard title="Top Companies">
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