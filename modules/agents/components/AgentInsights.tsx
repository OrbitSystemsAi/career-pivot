import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const insights = [
  "Resume Optimizer improved match score",
  "Job Scanner found new healthcare roles",
  "Network Builder identified referral paths",
];

export default function AgentInsights() {
  return (
    <PanelCard title="Insights">
      {insights.map((item) => (
        <ActionRow key={item} label={item} />
      ))}
    </PanelCard>
  );
}