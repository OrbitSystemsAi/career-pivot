import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { networkActions } from "../data/networkData";

export default function NetworkActions() {
  return (
    <PanelCard title="Actions">
      {networkActions.map((item) => (
        <ActionRow key={item} label={item} action="Run" />
      ))}
    </PanelCard>
  );
}