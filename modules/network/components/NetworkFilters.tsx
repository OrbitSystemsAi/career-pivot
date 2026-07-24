"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getNetworkIntelligence } from "@/modules/network/lib/networkIntelligence";

export default function NetworkFilters() {
  const { user } = useUser();
  const network = getNetworkIntelligence(user);

  return (
    <PanelCard title="Network Filters">
      <ActionRow
        label={
          network.hasConnections
            ? "Choose filters after selecting a network view"
            : network.hasConnectedSource
              ? "No network records available"
              : "No network source connected"
        }
      />
    </PanelCard>
  );
}
