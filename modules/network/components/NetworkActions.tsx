"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { getNetworkIntelligence } from "@/modules/network/lib/networkIntelligence";

export default function NetworkActions() {
  const { user } = useUser();
  const network = getNetworkIntelligence(user);

  return (
    <PanelCard title="Actions">
      <ActionRow
        label={
          network.hasConnectedSource
            ? "Network actions will use connected data only"
            : "Connect a network source to enable actions"
        }
      />
    </PanelCard>
  );
}
