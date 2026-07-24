"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getNetworkIntelligence } from "@/modules/network/lib/networkIntelligence";

export default function NetworkResults() {
  const { user } = useUser();
  const network = getNetworkIntelligence(user);

  return (
    <PanelCard title="Network Results">
      {!network.hasConnectedSource ? (
        <ActionRow label="No connected network results" />
      ) : (
        <>
          <ActionRow
            label="Relationships"
            value={String(network.connections.length)}
          />
          <ActionRow label="Warm paths" value={String(network.warmPaths)} />
          <ActionRow label="Recruiters" value={String(network.recruiters)} />
        </>
      )}
    </PanelCard>
  );
}
