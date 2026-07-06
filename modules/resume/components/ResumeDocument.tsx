"use client";

import { useUser } from "@/core/user/UserProvider";
import { resumeDocumentData } from "../data/resumeDocumentData";

export default function ResumeDocument() {
  const { user, activeResumeId } = useUser();

  const activeResume =
    user.resumes.find((resume) => resume.id === activeResumeId) ??
    user.resumes[0];

  const targetGoal = user.goals.find(
    (goal) => goal.id === activeResume?.targetGoalId
  );

  const savedDocumentContent = resumeDocumentData.find(
    (item) => item.resumeId === activeResume?.id
  );

  const documentContent =
    savedDocumentContent ?? {
      summary: `Uploaded resume file "${activeResume?.fileName ?? activeResume?.name}" has been added to the resume library. Full parsing will be connected later. For now, OSai is using the user's profile, skills, and selected target goal to create a working document preview.`,
      highlights: [
        {
          title: "Uploaded Resume Intake",
          description:
            "The resume has been captured as a new resume profile and can now be selected from the Resume Library.",
        },
        {
          title: "Profile-Based Preview",
          description:
            "The document preview is currently generated from the user profile, active resume metadata, skills, and target career goal.",
        },
        {
          title: "Future Parser Connection",
          description:
            "A backend parser will later extract work history, education, skills, certifications, and achievements directly from the uploaded file.",
        },
      ],
    };

  return (
    <div className="flex h-full w-full justify-center overflow-auto bg-slate-100 px-8 py-8">
      <div className="min-h-[980px] w-full max-w-[760px] rounded-sm border border-slate-200 bg-white px-12 py-10 shadow-lg">
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {user.name}
          </h1>

          <div className="mt-2 text-sm text-slate-500">
            {user.location} · {user.currentTitle} · {user.currentIndustry}
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
            Resume Version
          </h2>

          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div>
              <strong>Name:</strong> {activeResume?.name}
            </div>

            <div className="mt-1">
              <strong>Status:</strong> {activeResume?.status}
            </div>

            <div className="mt-1">
              <strong>Source:</strong> {activeResume?.source}
            </div>

            {activeResume?.fileName && (
              <div className="mt-1">
                <strong>File:</strong> {activeResume.fileName}
              </div>
            )}

            <div className="mt-1">
              <strong>Target Role:</strong>{" "}
              {targetGoal?.title ?? activeResume?.targetJobTitle}
            </div>

            <div className="mt-1">
              <strong>Target Industry:</strong>{" "}
              {targetGoal?.industry ?? "Not selected"}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}