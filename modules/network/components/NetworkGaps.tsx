"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getNetworkIntelligence } from "@/modules/network/lib/networkIntelligence";

export default function NetworkGaps() {
  const { user } = useUser();
  const network = getNetworkIntelligence(user);

  return (
    <PanelCard title="Network Gaps">
      <ActionRow
        label={
          network.hasConnections
            ? "Gap analysis needs a selected career target"
            : "No connected network data to analyze"
        }
      />
    </PanelCard>
  );
}
