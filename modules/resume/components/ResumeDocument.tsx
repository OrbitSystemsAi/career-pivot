"use client";

import { useState } from "react";
import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";
import { resumeDocumentData } from "../data/resumeDocumentData";

type PreviewMode = "preview" | "text" | "debug";

export default function ResumeDocument() {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("preview");
  const { user, activeResumeId } = useUser();

  const activeResume =
    user.resumes.find((resume) => resume.id === activeResumeId) ??
    user.resumes[0];

  const activeVersion =
    activeResume?.versions.find(
      (version) => version.id === activeResume.currentVersionId
    ) ?? activeResume?.versions[0];

  const targetGoal = user.goals.find(
    (goal) => goal.id === activeResume?.targetGoalId
  );

  const savedDocumentContent = resumeDocumentData.find(
    (item) => item.resumeId === activeResume?.id
  );

  const parsedDocument = activeVersion?.parsedDocument;
  const structuredResume = parsedDocument?.structuredResume;
  const optimizationSummary = parsedDocument?.optimizationSummary;

  function handlePrint() {
    window.print();
  }

  function handleDownloadOriginal() {
    if (!parsedDocument?.originalFileDataUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = parsedDocument.originalFileDataUrl;
    link.download =
      parsedDocument.originalFileName ?? parsedDocument.fileName ?? "resume.docx";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (parsedDocument?.htmlPreview && !savedDocumentContent) {
    const canDownloadOriginal = Boolean(parsedDocument.originalFileDataUrl);

    return (
      <div className="h-full w-full overflow-auto">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Document
            </div>

            <div className="mt-1 text-sm font-semibold text-slate-700">
              {parsedDocument.fileName}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setPreviewMode("preview")}
              className={`rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold ${
                previewMode === "preview"
                  ? "text-blue-600"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              Preview
            </button>

            <button
              onClick={() => setPreviewMode("text")}
              className={`rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold ${
                previewMode === "text"
                  ? "text-blue-600"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              Parsed Text
            </button>

            <button
              onClick={() => setPreviewMode("debug")}
              className={`rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold ${
                previewMode === "debug"
                  ? "text-blue-600"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              Debug
            </button>

            <button
              onClick={handlePrint}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-blue-50 hover:text-blue-600"
            >
              Print
            </button>

            <button
              onClick={handleDownloadOriginal}
              disabled={!canDownloadOriginal}
              className={`rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold ${
                canDownloadOriginal
                  ? "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                  : "cursor-not-allowed text-slate-300"
              }`}
            >
              Download Original
            </button>
          </div>
        </div>

        <div className="bg-slate-100 px-8 py-6">
          {previewMode === "preview" && (
            <div className="mx-auto min-h-[1056px] w-full max-w-[816px] rounded-sm border border-slate-200 bg-white px-12 py-10 shadow-sm print:mx-0 print:max-w-none print:border-0 print:shadow-none">
              {optimizationSummary && (
                <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                  <div className="font-semibold">
                    {optimizationSummary.label}
                  </div>

                  <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5">
                    {optimizationSummary.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div
                className="resume-preview text-sm leading-7 text-slate-800 [&_a]:text-blue-600 [&_h1]:mb-3 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mt-6 [&_h2]:text-sm [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-blue-600 [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-3 [&_strong]:font-bold [&_table]:w-full [&_td]:align-top"
                dangerouslySetInnerHTML={{
                  __html: parsedDocument.htmlPreview,
                }}
              />
            </div>
          )}

          {previewMode === "text" && (
            <div className="mx-auto min-h-[1056px] w-full max-w-[816px] rounded-sm border border-slate-200 bg-white px-12 py-10 shadow-sm">
              <div className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Extracted Text
              </div>

              {optimizationSummary && (
                <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                  <div className="font-semibold">
                    {optimizationSummary.label}
                  </div>

                  <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5">
                    {optimizationSummary.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {parsedDocument.rawText}
              </div>
            </div>
          )}

          {previewMode === "debug" && (
            <div className="mx-auto w-full max-w-[816px]">
              <PanelCard title="Parser Debug">
                <ActionRow label="Parse Status" value={activeResume.parseStatus} />
                <ActionRow label="Version" value={activeVersion?.label ?? "N/A"} />
                <ActionRow
                  label="Optimization"
                  value={optimizationSummary?.type ?? "None"}
                />
                <ActionRow
                  label="Raw Lines"
                  value={String(parsedDocument.lines.length)}
                />
                <ActionRow
                  label="Name"
                  value={structuredResume?.name ?? "Missing"}
                />
                <ActionRow
                  label="Email"
                  value={structuredResume?.contact.email ?? "Missing"}
                />
                <ActionRow
                  label="Phone"
                  value={structuredResume?.contact.phone ?? "Missing"}
                />
                <ActionRow
                  label="Skills"
                  value={String(structuredResume?.skills.length ?? 0)}
                />
                <ActionRow
                  label="Experience"
                  value={String(structuredResume?.experience.length ?? 0)}
                />
                <ActionRow
                  label="Education"
                  value={String(structuredResume?.education.length ?? 0)}
                />
                <ActionRow
                  label="Certifications"
                  value={String(structuredResume?.certifications.length ?? 0)}
                />
                <ActionRow
                  label="Unknown Sections"
                  value={String(structuredResume?.unknownSections.length ?? 0)}
                />
                <ActionRow
                  label="Unclassified Lines"
                  value={String(structuredResume?.unclassifiedLines.length ?? 0)}
                />
              </PanelCard>
            </div>
          )}
        </div>
      </div>
    );
  }

  const documentContent =
    savedDocumentContent ?? {
      summary:
        parsedDocument?.rawText ??
        `This document represents ${
          activeVersion?.label ?? "the selected version"
        }. OSai will connect parsed resume content and AI generated versions here.`,

      highlights: [
        {
          title: "Parsed Upload",
          description:
            parsedDocument?.fileName ??
            "No parsed upload is available for this version yet.",
        },
        {
          title: "Current Version",
          description: `You are viewing ${
            activeVersion?.label ?? "the active version"
          }.`,
        },
        {
          title: "Target Alignment",
          description:
            "Resume content adapts based on the selected target role and career goal.",
        },
      ],
    };

  return (
    <div className="h-full w-full overflow-auto">
      <div className="min-h-full w-full rounded-2xl border border-slate-200 bg-white px-12 py-10 shadow-sm">
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {user.name}
              </h1>

              <div className="mt-2 text-sm text-slate-500">
                {user.location} · {user.currentTitle} ·{" "}
                {user.currentIndustry}
              </div>
            </div>

            <div className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600">
              {activeVersion?.label}
            </div>
          </div>

          <div className="mt-4 text-sm font-semibold text-blue-600">
            Target: {targetGoal?.title ?? activeResume?.targetJobTitle}
          </div>
        </div>

        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Professional Summary
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-700">
            {documentContent.summary}
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Core Skills
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Experience Highlights
          </h2>

          <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
            {documentContent.highlights.map((highlight) => (
              <p key={highlight.title}>
                <strong className="text-slate-900">
                  {highlight.title} —
                </strong>{" "}
                {highlight.description}
              </p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}