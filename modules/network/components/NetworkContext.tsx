"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getNetworkIntelligence } from "@/modules/network/lib/networkIntelligence";

export default function NetworkContext() {
  const { user } = useUser();
  const network = getNetworkIntelligence(user);

  return (
    <PanelCard title="Network Context">
      {!network.hasConnectedSource ? (
        <ActionRow label="Connect a source to establish network context" />
      ) : (
        <>
          {network.connectedSources.map((source) => (
            <ActionRow
              key={source}
              label={source === "linkedin" ? "LinkedIn" : "OSai Network"}
              value="Connected"
            />
          ))}
          <ActionRow
            label="Available relationships"
            value={String(network.connections.length)}
          />
        </>
      )}
    </PanelCard>
  );
}
