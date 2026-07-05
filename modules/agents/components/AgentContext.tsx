import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const agents = ["Resume Optimizer", "Job Scanner", "Network Builder"];

export default function AgentContext() {
  return (
    <PanelCard title="Running Agents">
      {agents.map((agent) => (
        <ActionRow key={agent} label={agent} />
      ))}
    </PanelCard>
  );
}