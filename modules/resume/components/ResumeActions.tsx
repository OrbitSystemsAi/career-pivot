import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { resumeActions } from "../data/resumeData";

export default function ResumeActions() {
  return (
    <PanelCard title="Actions">
      {resumeActions.map((item) => (
        <ActionRow key={item} label={item} action="Run" />
      ))}
    </PanelCard>
  );
}