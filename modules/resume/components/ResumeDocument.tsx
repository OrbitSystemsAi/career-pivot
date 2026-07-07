"use client";

import { useUser } from "@/core/user/UserProvider";
import { resumeDocumentData } from "../data/resumeDocumentData";

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
  const structuredResume = parsedDocument?.structuredResume;

  if (structuredResume && !savedDocumentContent) {
    return (
      <div className="h-full w-full overflow-auto">
        <div className="min-h-full w-full rounded-2xl border border-slate-200 bg-white px-12 py-10 shadow-sm">
          <div className="border-b border-slate-200 pb-5">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {structuredResume.name ?? user.name}
                </h1>

                <div className="mt-2 text-sm text-slate-500">
                  {[
                    structuredResume.contact.email,
                    structuredResume.contact.phone,
                    structuredResume.contact.location,
                    structuredResume.contact.linkedin,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </div>

              <div className="shrink-0 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600">
                {activeVersion?.label}
              </div>
            </div>

            <div className="mt-4 text-sm font-semibold text-blue-600">
              Target: {targetGoal?.title ?? activeResume?.targetJobTitle}
            </div>
          </div>

          {structuredResume.summary && (
            <section className="mt-6">
              <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Professional Summary
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-700">
                {structuredResume.summary}
              </p>
            </section>
          )}

          {structuredResume.skills.length > 0 && (
            <section className="mt-6">
              <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Skills
              </h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {structuredResume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {structuredResume.experience.length > 0 && (
            <section className="mt-6">
              <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Experience
              </h2>

              <div className="mt-3 space-y-5">
                {structuredResume.experience.map((experience) => (
                  <div key={experience.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {experience.title}
                        </div>

                        <div className="mt-1 text-sm text-slate-600">
                          {experience.company}
                        </div>
                      </div>

                      {(experience.startDate || experience.endDate) && (
                        <div className="text-xs text-slate-400">
                          {experience.startDate} –{" "}
                          {experience.endDate ?? "Present"}
                        </div>
                      )}
                    </div>

                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                      {experience.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {structuredResume.education.length > 0 && (
            <section className="mt-6">
              <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Education
              </h2>

              <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {structuredResume.education.map((education) => (
                  <div key={education}>{education}</div>
                ))}
              </div>
            </section>
          )}

          {structuredResume.certifications.length > 0 && (
            <section className="mt-6">
              <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Certifications
              </h2>

              <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {structuredResume.certifications.map((certification) => (
                  <div key={certification}>{certification}</div>
                ))}
              </div>
            </section>
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

        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Version Details
          </h2>

          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div>
              <strong>Resume:</strong> {activeResume?.name}
            </div>

            <div className="mt-1">
              <strong>Current Version:</strong> {activeVersion?.label}
            </div>

            <div className="mt-1">
              <strong>Version Source:</strong> {activeVersion?.source}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}