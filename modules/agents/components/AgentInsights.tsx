"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getAgentIntelligence } from "@/modules/agents/lib/agentIntelligence";

export default function AgentInsights() {
  const { user } = useUser();
  const agents = getAgentIntelligence(user);

  return (
    <PanelCard title="Insights">
      <ActionRow
        label={
          agents.completedTasks > 0
            ? "Agent insights are based on completed work"
            : "No completed agent work to analyze"
        }
      />
    </PanelCard>
  );
}
