"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getAgentIntelligence } from "@/modules/agents/lib/agentIntelligence";

export default function AgentFilters() {
  const { user } = useUser();
  const agents = getAgentIntelligence(user);

  return (
    <PanelCard title="Agent Filters">
      <ActionRow
        label={
          agents.recruitedAgents.length > 0
            ? "Select a view to filter your agent team"
            : "No agents recruited"
        }
      />
    </PanelCard>
  );
}
