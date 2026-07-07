"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";

export default function ResumeParserDebug() {
  const { user, activeResumeId } = useUser();

  const activeResume =
    user.resumes.find((resume) => resume.id === activeResumeId) ??
    user.resumes[0];

  const activeVersion =
    activeResume?.versions.find(
      (version) => version.id === activeResume.currentVersionId
    ) ?? activeResume?.versions[0];

  const parsedDocument = activeVersion?.parsedDocument;
  const structuredResume = parsedDocument?.structuredResume;

  if (!parsedDocument || !structuredResume) {
    return (
      <PanelCard title="Parser Debug">
        <ActionRow label="Status" value="No parsed document" />
      </PanelCard>
    );
  }

  return (
    <PanelCard title="Parser Debug">
      <ActionRow
        label="Parse Status"
        value={activeResume.parseStatus}
      />

      <ActionRow
        label="Raw Lines"
        value={String(parsedDocument.lines.length)}
      />

      <ActionRow
        label="Name"
        value={structuredResume.name ?? "Missing"}
      />

      <ActionRow
        label="Email"
        value={structuredResume.contact.email ?? "Missing"}
      />

      <ActionRow
        label="Phone"
        value={structuredResume.contact.phone ?? "Missing"}
      />

      <ActionRow
        label="Skills"
        value={String(structuredResume.skills.length)}
      />

      <ActionRow
        label="Experience"
        value={String(structuredResume.experience.length)}
      />

      <ActionRow
        label="Education"
        value={String(structuredResume.education.length)}
      />

      <ActionRow
        label="Certifications"
        value={String(structuredResume.certifications.length)}
      />

      <ActionRow
        label="Unknown Sections"
        value={String(structuredResume.unknownSections.length)}
      />

      <ActionRow
        label="Unclassified Lines"
        value={String(structuredResume.unclassifiedLines.length)}
      />

      <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
        Parser health check verifies that no resume data is lost during upload.
      </div>
    </PanelCard>
  );
}