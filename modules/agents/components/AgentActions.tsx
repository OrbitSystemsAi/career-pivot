"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getAgentIntelligence } from "@/modules/agents/lib/agentIntelligence";

export default function AgentActions() {
  const { user } = useUser();
  const agents = getAgentIntelligence(user);

  return (
    <PanelCard title="Actions">
      <ActionRow
        label={
          agents.recruitedAgents.length > 0
            ? "Select an agent to review available tasks"
            : "Recruit an agent from the main workspace"
        }
      />
    </PanelCard>
  );
}
