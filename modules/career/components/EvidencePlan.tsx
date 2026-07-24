"use client";

import { useState } from "react";
import { useOSState } from "@/core/state/OSStateProvider";
import ModalPortal from "@/core/ui/ModalPortal";
import { useUser } from "@/core/user/UserProvider";
import type { GapStatus } from "@/core/planning/planningTypes";
import { generateEvidenceBackedPlan } from "@/core/planning/roadmapEngine";
import { createAgentArtifact } from "@/core/planning/executionEngine";
import type { AgentArtifact } from "@/core/user/userTypes";
import { getSelectedCareerChoices } from "@/modules/career/lib/careerIntelligence";

type PlanSection = "roadmap" | "gaps" | "evidence";

const statusStyles: Record<GapStatus, string> = {
  satisfied: "bg-emerald-50 text-emerald-700",
  transferable: "bg-blue-50 text-blue-700",
  partial: "bg-amber-50 text-amber-700",
  missing: "bg-rose-50 text-rose-700",
  unknown: "bg-slate-100 text-slate-600",
};

function formatStatus(status: GapStatus) {
  return status.replaceAll("_", " ");
}

export default function EvidencePlan() {
  const { user, activeResumeId, updatePlanningProgress } = useUser();
  const { setActiveModule, setActiveView } = useOSState();
  const [section, setSection] = useState<PlanSection>("roadmap");
  const [evidenceTask, setEvidenceTask] = useState<{
    taskId: string;
    requirementId: string;
    taskTitle: string;
  }>();
  const [evidenceClaim, setEvidenceClaim] = useState("");
  const [evidenceDetail, setEvidenceDetail] = useState("");
  const [reviewArtifact, setReviewArtifact] = useState<AgentArtifact>();
  const plan = generateEvidenceBackedPlan(user, activeResumeId);
  const goal = user.goals.find((item) => Boolean(item.setupCompletedAt));
  const paths = getSelectedCareerChoices(user);

  if (!plan || !goal || !paths.length) {
    const requirements = [
      { key: "goal", label: "Career Goal", complete: Boolean(goal) },
      { key: "path", label: "Career Path", complete: paths.length > 0 },
    ] as const;
    const completedCount = requirements.filter(
      (requirement) => requirement.complete
    ).length;

    return (
      <div className="flex h-full w-full items-center justify-center bg-white p-8">
        <section className="w-full max-w-4xl rounded-3xl border border-[#c8dfe9] bg-[linear-gradient(145deg,#f8fcfe,#e3f3f9)] p-8 shadow-sm">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#173a46] text-lg text-white">
              ➋
            </div>
            <div className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#2b6874]">
              Goal → Path → Plan
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#102f39]">
              A plan needs a destination and a route
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Complete at least one Career Goal and select at least one Career
              Path. Your evidence-backed roadmap will unlock when both are
              saved.
            </p>
            <div className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#2b6874]">
              {completedCount} of 2 complete
            </div>
          </div>

          <div className="mx-auto mt-7 grid max-w-2xl gap-3 sm:grid-cols-2">
            {requirements.map((requirement, index) => (
              <div
                key={requirement.key}
                className={`rounded-2xl border p-5 ${
                  requirement.complete
                    ? "border-[#a8d9d0] bg-[#e8f5f1]"
                    : "border-[#c8dfe9] bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2b6874]">
                      Step {index + 1}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-[#102f39]">
                      {requirement.label}
                    </div>
                  </div>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                      requirement.complete
                        ? "bg-[#168391] text-white"
                        : "bg-[#edf4f6] text-[#2b6874]"
                    }`}
                  >
                    {requirement.complete ? "✓" : index + 1}
                  </div>
                </div>

                {requirement.complete ? (
                  <div className="mt-5 text-xs font-semibold text-[#168391]">
                    Complete
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModule("career");
                      setActiveView(requirement.key === "goal" ? "goal" : "market");
                    }}
                    className="mt-5 rounded-xl bg-[#164858] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#f28c28] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168391] focus-visible:ring-offset-2"
                  >
                    Complete {requirement.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const activeGoal = goal;
  const activePlan = plan;
  const evidenceById = new Map(
    activePlan.evidence.map((item) => [item.id, item])
  );

  function startTask(taskId: string) {
    updatePlanningProgress({
      ...user.planningProgress,
      taskStatuses: {
        ...user.planningProgress.taskStatuses,
        [taskId]: "in_progress",
      },
    });
  }

  function runAgent(
    task: Parameters<typeof createAgentArtifact>[1],
    requirementId: string
  ) {
    const artifact = createAgentArtifact(activeGoal, task, requirementId);
    updatePlanningProgress({
      ...user.planningProgress,
      taskStatuses: {
        ...user.planningProgress.taskStatuses,
        [task.id]: "in_progress",
      },
      agentArtifacts: [...user.planningProgress.agentArtifacts, artifact],
    });
    setReviewArtifact(artifact);
  }

  function updateArtifactStatus(
    artifact: AgentArtifact,
    status: AgentArtifact["status"]
  ) {
    const accepted = status === "accepted";
    updatePlanningProgress({
      taskStatuses: {
        ...user.planningProgress.taskStatuses,
        [artifact.taskId]: "in_progress",
      },
      submittedEvidence: accepted
        ? [
            ...user.planningProgress.submittedEvidence,
            {
              id: `submitted-${Date.now()}`,
              goalId: artifact.goalId,
              requirementId: artifact.requirementId,
              taskId: artifact.taskId,
              claim: artifact.title,
              detail: artifact.content.join(" "),
              origin: "agent_artifact",
              createdAt: new Date().toISOString(),
            },
          ]
        : user.planningProgress.submittedEvidence,
      agentArtifacts: user.planningProgress.agentArtifacts.map((item) =>
        item.id === artifact.id ? { ...item, status } : item
      ),
    });
    setReviewArtifact(undefined);
  }

  function requestCompletion(
    taskId: string,
    requirementId: string,
    taskTitle: string
  ) {
    setEvidenceTask({ taskId, requirementId, taskTitle });
    setEvidenceClaim("");
    setEvidenceDetail("");
  }

  function submitCompletionEvidence() {
    if (!evidenceTask || !evidenceClaim.trim() || !evidenceDetail.trim()) return;
    const evidenceId = `submitted-${activeGoal.id}-${evidenceTask.taskId}-${user.planningProgress.submittedEvidence.length + 1}`;
    updatePlanningProgress({
      taskStatuses: {
        ...user.planningProgress.taskStatuses,
        [evidenceTask.taskId]: "complete",
      },
      submittedEvidence: [
        ...user.planningProgress.submittedEvidence,
        {
          id: evidenceId,
          goalId: activeGoal.id,
          requirementId: evidenceTask.requirementId,
          taskId: evidenceTask.taskId,
          claim: evidenceClaim.trim(),
          detail: evidenceDetail.trim(),
          origin: "user",
          createdAt: new Date().toISOString(),
        },
      ],
      agentArtifacts: user.planningProgress.agentArtifacts,
    });
    setEvidenceTask(undefined);
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-5">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Evidence-backed plan
              </div>
              <h2 className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight text-slate-950">
                {activeGoal.statement}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Every gap and milestone remains connected to its supporting evidence and assumptions.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="min-w-28 rounded-2xl bg-slate-950 px-4 py-3 text-white">
                <div className="text-xl font-semibold">{activePlan.readiness}%</div>
                <div className="text-[11px] text-slate-400">Readiness</div>
              </div>
              <div className="min-w-28 rounded-2xl bg-blue-50 px-4 py-3">
                <div className="text-xl font-semibold text-blue-800">{activePlan.evidenceCoverage}%</div>
                <div className="text-[11px] text-blue-600">Evidence coverage</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4">
            <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
              {(["roadmap", "gaps", "evidence"] as PlanSection[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSection(item)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold capitalize transition ${
                    section === item
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="text-xs text-slate-500">
              Planning range: <span className="font-semibold text-slate-800">{activeGoal.guidance.recommendedTimelineMonths} months</span>
            </div>
          </div>
        </header>

        {section === "roadmap" && (
          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4">
              {activePlan.phases.map((phase, phaseIndex) => (
                <section key={phase.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                      {phaseIndex + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-base font-semibold text-slate-900">{phase.title}</h3>
                        <span className="text-xs text-slate-400">Months {phase.startMonth}–{phase.endMonth}</span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{phase.purpose}</p>
                    </div>
                  </div>

                  <div className="ml-4 mt-5 border-l border-slate-200 pl-8">
                    {phase.milestones.length ? (
                      <div className="space-y-4">
                        {phase.milestones.map((milestone) => (
                          <article key={milestone.id} className="relative rounded-2xl border border-slate-200 p-4">
                            <span className="absolute -left-[2.7rem] top-5 h-3 w-3 rounded-full border-2 border-white bg-blue-500 ring-1 ring-slate-200" />
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className="text-sm font-semibold text-slate-900">{milestone.title}</h4>
                                <p className="mt-1 text-xs leading-5 text-slate-500">{milestone.outcome}</p>
                              </div>
                              <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-600">
                                Month {milestone.targetMonth}
                              </span>
                            </div>
                            <div className="mt-4 space-y-2">
                              {milestone.tasks.map((task) => (
                                <div key={task.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
                                  <div>
                                    <div className="text-xs font-medium text-slate-700">{task.title}</div>
                                    <div className="mt-0.5 text-[11px] text-slate-400">Output: {task.output}</div>
                                  </div>
                                  <div className="flex shrink-0 items-center gap-3">
                                    <div className="text-right text-[10px] uppercase tracking-wide text-slate-400">
                                      {task.owner}<br />{task.estimatedHours}h
                                    </div>
                                    {task.owner === "agent" && task.status !== "complete" ? (
                                      (() => {
                                        const artifact = [...user.planningProgress.agentArtifacts]
                                          .reverse()
                                          .find(
                                            (item) =>
                                              item.taskId === task.id &&
                                              item.status === "draft"
                                          );
                                        const acceptedArtifact = [...user.planningProgress.agentArtifacts]
                                          .reverse()
                                          .find(
                                            (item) =>
                                              item.taskId === task.id &&
                                              item.status === "accepted"
                                          );
                                        return artifact ? (
                                          <button type="button" onClick={() => setReviewArtifact(artifact)} className="rounded-lg bg-violet-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-violet-500">
                                            Review draft
                                          </button>
                                        ) : acceptedArtifact ? (
                                          <button type="button" onClick={() => requestCompletion(task.id, milestone.requirementIds[0] ?? "target-definition", task.title)} className="rounded-lg bg-blue-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-blue-500">
                                            Add outcome evidence
                                          </button>
                                        ) : (
                                          <button type="button" onClick={() => runAgent(task, milestone.requirementIds[0] ?? "target-definition")} className="rounded-lg bg-slate-950 px-3 py-2 text-[11px] font-semibold text-white hover:bg-violet-700">
                                            Run agent
                                          </button>
                                        );
                                      })()
                                    ) : task.status === "not_started" ? (
                                      <button type="button" onClick={() => startTask(task.id)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 hover:bg-blue-50">
                                        Start
                                      </button>
                                    ) : task.status === "in_progress" ? (
                                      <button type="button" onClick={() => requestCompletion(task.id, milestone.requirementIds[0] ?? "target-definition", task.title)} className="rounded-lg bg-blue-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-blue-500">
                                        Add evidence
                                      </button>
                                    ) : (
                                      <span className="rounded-lg bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700">Complete</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-emerald-50 p-4 text-xs leading-5 text-emerald-800">
                        No additional milestones are needed in this phase based on current evidence.
                      </div>
                    )}
                  </div>
                </section>
              ))}
            </div>

            <aside className="space-y-4">
              <section className="rounded-3xl bg-slate-950 p-5 text-white">
                <div className="text-xs font-semibold uppercase tracking-wide text-blue-300">Next best action</div>
                <h3 className="mt-3 text-lg font-semibold">{activePlan.nextAction.title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-300">{activePlan.nextAction.output}</p>
                <div className="mt-4 flex justify-between border-t border-slate-700 pt-4 text-[11px] uppercase tracking-wide text-slate-400">
                  <span>{activePlan.nextAction.owner} owned</span>
                  <span>{activePlan.nextAction.estimatedHours} hours</span>
                </div>
              </section>
              <section className="rounded-3xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-slate-900">Risks to monitor</h3>
                <ul className="mt-3 space-y-3 text-xs leading-5 text-slate-600">
                  {activePlan.risks.map((risk) => <li key={risk}>• {risk}</li>)}
                </ul>
              </section>
              <section className="rounded-3xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-slate-900">Plan assumptions</h3>
                <ul className="mt-3 space-y-3 text-xs leading-5 text-slate-600">
                  {activePlan.assumptions.map((assumption) => <li key={assumption}>• {assumption}</li>)}
                </ul>
              </section>
            </aside>
          </div>
        )}

        {section === "gaps" && (
          <div className="mt-5 space-y-3">
            {activePlan.requirements.map((requirement) => (
              <article key={requirement.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{requirement.label}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{requirement.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wide text-slate-400">{requirement.importance}</span>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${statusStyles[requirement.status]}`}>
                      {formatStatus(requirement.status)}
                    </span>
                  </div>
                </div>
                <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">{requirement.reason}</p>
                {requirement.evidenceIds.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {requirement.evidenceIds.map((id) => (
                      <span key={id} className="rounded-full border border-slate-200 px-3 py-1 text-[11px] text-slate-500">
                        {evidenceById.get(id)?.claim ?? id}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {section === "evidence" && (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {activePlan.evidence.map((evidence) => (
              <article key={evidence.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{evidence.claim}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{evidence.detail}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    {evidence.strength}
                  </span>
                </div>
                <div className="mt-4 flex justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                  <span>{evidence.sourceLabel}</span>
                  <span>{Math.round(evidence.confidence * 100)}% confidence</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {evidenceTask && (
        <ModalPortal>
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="evidence-dialog-title" className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="evidence-dialog-title" className="text-lg font-semibold text-slate-950">Add completion evidence</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">{evidenceTask.taskTitle}</p>
              </div>
              <button type="button" onClick={() => setEvidenceTask(undefined)} aria-label="Close evidence dialog" className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100">×</button>
            </div>
            <label className="mt-6 block text-xs font-semibold text-slate-700">
              What was accomplished?
              <input value={evidenceClaim} onChange={(event) => setEvidenceClaim(event.target.value)} placeholder="Confirmed prerequisite courses with three programs" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-400" />
            </label>
            <label className="mt-4 block text-xs font-semibold text-slate-700">
              Evidence details
              <textarea value={evidenceDetail} onChange={(event) => setEvidenceDetail(event.target.value)} placeholder="Describe the source, result, link, document, or verification that supports this claim." className="mt-2 min-h-28 w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal leading-6 outline-none focus:border-blue-400" />
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEvidenceTask(undefined)} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
              <button type="button" onClick={submitCompletionEvidence} disabled={!evidenceClaim.trim() || !evidenceDetail.trim()} className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Save evidence and complete</button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}

      {reviewArtifact && (
        <ModalPortal>
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="artifact-dialog-title" className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-violet-600">Agent draft · review required</div>
                <h2 id="artifact-dialog-title" className="mt-1 text-xl font-semibold text-slate-950">{reviewArtifact.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{reviewArtifact.summary}</p>
              </div>
              <button type="button" onClick={() => setReviewArtifact(undefined)} aria-label="Close agent draft" className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100">×</button>
            </div>
            <div className="mt-6 space-y-3">
              {reviewArtifact.content.map((item, index) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-50 text-[11px] font-semibold text-violet-700">{index + 1}</span>
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
              Accepting this draft records it as evidence and completes the linked task. It does not send messages or perform external actions.
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={() => updateArtifactStatus(reviewArtifact, "rejected")} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">Reject draft</button>
              <button type="button" onClick={() => setReviewArtifact(undefined)} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">Keep for later</button>
              <button type="button" onClick={() => updateArtifactStatus(reviewArtifact, "accepted")} className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-500">Accept as evidence</button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}
    </div>
  );
}
