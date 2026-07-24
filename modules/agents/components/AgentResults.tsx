"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getAgentIntelligence } from "@/modules/agents/lib/agentIntelligence";

export default function AgentResults() {
  const { user } = useUser();
  const agents = getAgentIntelligence(user);

  return (
    <PanelCard title="Latest Result">
      {agents.completedTasks > 0 ? (
        <>
          <ActionRow label="Completed tasks" value={String(agents.completedTasks)} />
          <ActionRow
            label="Opportunities found"
            value={String(agents.opportunitiesFound)}
          />
        </>
      ) : (
        <ActionRow label="No agent results yet" />
      )}
    </PanelCard>
  );
}
