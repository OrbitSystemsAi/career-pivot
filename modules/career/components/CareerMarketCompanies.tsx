import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const companies = [
  {
    label: "Microsoft",
    value: "94%",
  },
  {
    label: "Salesforce",
    value: "91%",
  },
  {
    label: "ServiceNow",
    value: "88%",
  },
];

export default function CareerMarketCompanies() {
  return (
    <PanelCard title="Target Companies">
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