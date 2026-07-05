import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { resumeGaps } from "../data/resumeData";

export default function ResumeGaps() {
  return (
    <PanelCard title="Opportunities">
      {resumeGaps.map((item) => (
        <ActionRow key={item} label={item} />
      ))}
    </PanelCard>
  );
}