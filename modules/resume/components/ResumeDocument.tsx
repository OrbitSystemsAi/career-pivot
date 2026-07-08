"use client";

import { useUser } from "@/core/user/UserProvider";
import { resumeDocumentData } from "../data/resumeDocumentData";

function isLikelyBullet(line: string) {
  return (
    line.startsWith("•") ||
    line.startsWith("-") ||
    /^[A-Z][A-Za-z\s&/()+.-]+$/.test(line)
  );
}

export default function ResumeDocument() {
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
  const documentResume = parsedDocument?.documentResume;

  if (documentResume && !savedDocumentContent) {
    return (
      <div className="h-full w-full overflow-auto">
        <div className="min-h-full w-full rounded-2xl border border-slate-200 bg-white px-12 py-10 shadow-sm">
          <div className="border-b border-slate-200 pb-5">
            <div className="flex items-start justify-between gap-8">
              <div className="space-y-1 text-sm text-slate-500">
                {documentResume.headerLines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>

              <div className="shrink-0 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600">
                {activeVersion?.label}
              </div>
            </div>

            {documentResume.headline && (
              <div className="mt-8 text-xl font-bold leading-8 text-slate-900">
                {documentResume.headline}
              </div>
            )}

            <div className="mt-4 text-sm font-semibold text-blue-600">
              Target: {targetGoal?.title ?? activeResume?.targetJobTitle}
            </div>
          </div>

          {documentResume.sections.map((section) => (
            <section key={section.id} className="mt-6">
              <h2 className="text-sm font-bold text-blue-600">
                {section.title}
              </h2>

              <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
                {section.lines.map((line) =>
                  isLikelyBullet(line) ? (
                    <div key={line} className="flex gap-3">
                      <span className="mt-[0.15rem] text-slate-400">•</span>
                      <span>{line.replace(/^[-•*]\s*/, "")}</span>
                    </div>
                  ) : (
                    <p key={line}>{line}</p>
                  )
                )}
              </div>
            </section>
          ))}
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