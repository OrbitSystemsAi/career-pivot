"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getAgentIntelligence } from "@/modules/agents/lib/agentIntelligence";

export default function AgentContext() {
  const { user } = useUser();
  const agents = getAgentIntelligence(user);

  return (
    <PanelCard title="Recruited Agents">
      {agents.recruitedAgents.length > 0 ? (
        agents.recruitedAgents.map((agent) => (
          <ActionRow
            key={agent.id}
            label={agent.name}
            value={agent.status === "active" ? "Active" : "Paused"}
          />
        ))
      ) : (
        <ActionRow label="Recruit an agent to get started" />
      )}
    </PanelCard>
  );
}
