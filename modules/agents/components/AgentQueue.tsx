"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getAgentIntelligence } from "@/modules/agents/lib/agentIntelligence";

export default function AgentQueue() {
  const { user } = useUser();
  const agents = getAgentIntelligence(user);
  const queuedRuns = agents.taskRuns.filter(
    (run) => run.status === "queued" || run.status === "running"
  );

  return (
    <PanelCard title="Queue">
      {queuedRuns.length > 0 ? (
        queuedRuns.map((run) => (
          <ActionRow key={run.id} label={`Agent task ${run.id}`} value={run.status} />
        ))
      ) : (
        <ActionRow label="No agent tasks queued" />
      )}
    </PanelCard>
  );
}
