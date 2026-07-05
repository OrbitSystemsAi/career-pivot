import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { resumeStrengths } from "../data/resumeData";

export default function ResumeStrengths() {
  return (
    <PanelCard title="Strengths">
      {resumeStrengths.map((item) => (
        <ActionRow key={item} label={item} />
      ))}
    </PanelCard>
  );
}