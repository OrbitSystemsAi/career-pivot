import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { networkConnections } from "../data/networkData";

export default function NetworkConnections() {
  return (
    <PanelCard title="Connections">
      {networkConnections.map((item) => (
        <ActionRow key={item} label={item} />
      ))}
    </PanelCard>
  );
}