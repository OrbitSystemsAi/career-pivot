import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";

const tasks = [
  "Analyze target job descriptions",
  "Refresh career graph",
  "Score resume against healthcare roles",
];

export default function AgentQueue() {
  return (
    <PanelCard title="Queue">
      {tasks.map((item) => (
        <ActionRow key={item} label={item} action="Run" />
      ))}
    </PanelCard>
  );
}