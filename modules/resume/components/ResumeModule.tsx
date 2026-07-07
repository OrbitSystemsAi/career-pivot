"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";

function getResumeScore(skillCount: number, experienceCount: number) {
  return Math.min(95, 60 + skillCount * 3 + experienceCount * 5);
}

function getAtsScore(skillCount: number) {
  return Math.min(92, 55 + skillCount * 4);
}

function getRoleAlignmentScore(hasTargetRole: boolean, skillCount: number) {
  return Math.min(96, (hasTargetRole ? 70 : 50) + skillCount * 3);
}

function getReadiness(score: number) {
  if (score >= 85) {
    return "High";
  }

  if (score >= 70) {
    return "Medium";
  }

  return "Low";
}

export default function ResumeModule() {
  const { user, activeResumeId } = useUser();

  const activeResume =
    user.resumes.find((resume) => resume.id === activeResumeId) ??
    user.resumes[0];

  const activeVersion =
    activeResume?.versions.find(
      (version) => version.id === activeResume.currentVersionId
    ) ?? activeResume?.versions[0];

  const structuredResume = activeVersion?.parsedDocument?.structuredResume;

  const targetGoal = user.goals.find(
    (goal) => goal.id === activeResume?.targetGoalId
  );

  const skillCount = structuredResume?.skills.length ?? user.skills.length;
  const experienceCount = structuredResume?.experience.length ?? 1;
  const hasTargetRole = Boolean(targetGoal?.title ?? activeResume?.targetJobTitle);

  const resumeScore = getResumeScore(skillCount, experienceCount);
  const atsScore = getAtsScore(skillCount);
  const roleAlignmentScore = getRoleAlignmentScore(hasTargetRole, skillCount);
  const readiness = getReadiness(resumeScore);

  return (
    <div className="grid h-full min-h-[520px] grid-cols-[1fr_22rem] gap-4 overflow-auto">
      <PanelCard title="Resume Intelligence Summary">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <div className="text-3xl font-bold text-blue-600">
              {resumeScore}%
            </div>

            <div className="mt-2 text-xs font-semibold text-slate-500">
              Resume Score
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <div className="text-3xl font-bold text-blue-600">
              {atsScore}%
            </div>

            <div className="mt-2 text-xs font-semibold text-slate-500">
              ATS Match
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <div className="text-3xl font-bold text-blue-600">
              {roleAlignmentScore}%
            </div>

            <div className="mt-2 text-xs font-semibold text-slate-500">
              Role Alignment
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <div className="text-3xl font-bold text-blue-600">{readiness}</div>

            <div className="mt-2 text-xs font-semibold text-slate-500">
              Recruiter Readiness
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase text-slate-500">
            Active Resume
          </div>

          <div className="mt-2 text-sm font-semibold text-slate-700">
            {activeResume?.name ?? "No resume selected"}
          </div>

          <div className="mt-1 text-xs text-slate-500">
            Current version: {activeVersion?.label ?? "No version selected"}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase text-slate-500">
            Target
          </div>

          <div className="mt-2 text-sm font-semibold text-slate-700">
            {targetGoal?.title ?? activeResume?.targetJobTitle ?? "No target selected"}
          </div>

          <div className="mt-1 text-xs text-slate-500">
            Optimizing resume language, keywords, and positioning.
          </div>
        </div>
      </PanelCard>

      <PanelCard title="AI Recommendations">
        <ActionRow label="Detected Skills" value={String(skillCount)} />

        <ActionRow
          label="Experience Sections"
          value={String(experienceCount)}
        />

        <ActionRow
          label="Improve"
          value={skillCount < 8 ? "Keyword Depth" : "Executive Impact"}
        />

        <ActionRow
          label="Improve"
          value={experienceCount < 2 ? "Experience Detail" : "Role Framing"}
        />

        <ActionRow label="Suggested Action" action="Optimize" />

        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
          Summary uses the selected resume version, parsed skills, parsed
          experience, and target role to create a working intelligence view.
        </div>
      </PanelCard>
    </div>
  );
}