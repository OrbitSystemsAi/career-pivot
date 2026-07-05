import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { networkGaps } from "../data/networkData";

export default function NetworkGaps() {
  return (
    <PanelCard title="Network Gaps">
      {networkGaps.map((item) => (
        <ActionRow key={item} label={item} />
      ))}
    </PanelCard>
  );
}