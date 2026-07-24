"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getNetworkIntelligence } from "@/modules/network/lib/networkIntelligence";

export default function NetworkConnections() {
  const { user } = useUser();
  const network = getNetworkIntelligence(user);

  return (
    <PanelCard title="Connections">
      {network.connections.length > 0 ? (
        network.connections.map((connection) => (
          <ActionRow
            key={connection.id}
            label={connection.name}
            value={connection.company}
          />
        ))
      ) : (
        <ActionRow label="No network connections available" />
      )}
    </PanelCard>
  );
}
