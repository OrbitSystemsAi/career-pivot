"use client";

import { useMemo, useState } from "react";
import { useUser } from "@/core/user/UserProvider";
import type {
  GapStatus,
  PlanMilestone,
  PlanRequirement,
} from "@/core/planning/planningTypes";
import { generateEvidenceBackedPlan } from "@/core/planning/roadmapEngine";
import GoalCreation from "./GoalCreation";

type MapMode = "map" | "timeline";
type MapSelection =
  | { kind: "requirement"; item: PlanRequirement }
  | { kind: "milestone"; item: PlanMilestone }
  | { kind: "target" };

const routeColors = {
  main: "#1675e0",
  evidence: "#0e9fac",
  opportunity: "#e89a00",
  alternate: "#8e42b8",
  blocker: "#ef5b5b",
  navy: "#062e52",
};

const requirementColors: Record<GapStatus, string> = {
  satisfied: routeColors.evidence,
  transferable: routeColors.evidence,
  partial: routeColors.opportunity,
  missing: routeColors.blocker,
  unknown: "#64748b",
};

function NodeIcon({ type }: { type: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "target") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M6 20V5m0 0c4-3 8 3 12 0v9c-4 3-8-3-12 0" /></svg>;
  }
  if (type.includes("education") || type.includes("prerequisite") || type.includes("program")) {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="m3 9 9-5 9 5-9 5-9-5Zm4 3v5c3 2 7 2 10 0v-5m4-2v6" /></svg>;
  }
  if (type.includes("relationship") || type.includes("network")) {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle {...common} cx="8" cy="8" r="3" /><circle {...common} cx="17" cy="9" r="2.5" /><path {...common} d="M2.5 19c.7-4 3-6 5.5-6s4.8 2 5.5 6m0-4c2.7-.8 6 .5 7 4" /></svg>;
  }
  if (type.includes("proof") || type.includes("portfolio")) {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M6 3h9l4 4v14H6V3Zm9 0v5h4M9 12h7M9 16h5" /></svg>;
  }
  if (type.includes("opportunity") || type.includes("customer") || type.includes("offer")) {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle {...common} cx="10" cy="10" r="6" /><path {...common} d="m15 15 5 5" /></svg>;
  }
  if (type.includes("time") || type.includes("capacity") || type.includes("constraint")) {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle {...common} cx="12" cy="12" r="9" /><path {...common} d="M12 7v6l4 2" /></svg>;
  }
  if (type === "today") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle {...common} cx="12" cy="8" r="4" /><path {...common} d="M5 21c.8-5 3.2-8 7-8s6.2 3 7 8" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M5 12h14M12 5l7 7-7 7" /></svg>;
}

function StatusLabel({ status }: { status: GapStatus | PlanMilestone["status"] }) {
  const label =
    status === "satisfied" || status === "complete"
      ? "Verified"
      : status === "missing"
        ? "Missing evidence"
        : status === "partial" || status === "in_progress"
          ? "In progress"
          : status === "transferable"
            ? "Transferable"
            : "Not started";
  const tone =
    status === "satisfied" || status === "complete"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "missing"
        ? "border-rose-200 bg-rose-50 text-rose-600"
        : status === "partial" || status === "in_progress"
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-slate-200 bg-slate-50 text-slate-500";
  return <span className={`rounded border px-1.5 py-0.5 text-[9px] font-semibold ${tone}`}>{label}</span>;
}

function MapNode({
  x,
  y,
  title,
  subtitle,
  color,
  icon,
  status,
  selected,
  emphasized,
  onClick,
}: {
  x: number;
  y: number;
  title: string;
  subtitle?: string;
  color: string;
  icon: string;
  status: GapStatus | PlanMilestone["status"];
  selected: boolean;
  emphasized?: boolean;
  onClick: () => void;
}) {
  const dashed = status === "missing" || status === "unknown";
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute z-10 w-36 -translate-x-1/2 -translate-y-1/2 text-center focus:outline-none"
      style={{ left: x, top: y }}
    >
      {emphasized && <span className="mb-2 inline-block rounded bg-[#062e52] px-2 py-1 text-[9px] font-semibold text-white shadow-sm">Next best action</span>}
      <span
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-current transition ${selected ? "ring-4 ring-blue-100" : ""}`}
        style={{
          color,
          border: `3px ${dashed ? "dashed" : "solid"} ${color}`,
          boxShadow: emphasized ? `0 0 0 5px white, 0 0 0 7px ${color}` : undefined,
        }}
      >
        <span className="h-7 w-7"><NodeIcon type={icon} /></span>
      </span>
      <span className="mt-2 block text-[11px] font-semibold leading-4 text-slate-800">{title}</span>
      {subtitle && <span className="mt-0.5 block text-[9px] leading-3 text-slate-500">{subtitle}</span>}
      <span className="mt-1 inline-block"><StatusLabel status={status} /></span>
    </button>
  );
}

function milestoneStatus(milestone: PlanMilestone) {
  return milestone.status;
}

export default function CareerMapCanvas({ mode = "map" }: { mode?: MapMode }) {
  const { user, activeResumeId } = useUser();
  const [zoom, setZoom] = useState(0.96);
  const [selection, setSelection] = useState<MapSelection>();
  const plan = generateEvidenceBackedPlan(user, activeResumeId);
  const goal = user.goals[0];

  const milestones = useMemo(
    () => plan?.phases.flatMap((phase) => phase.milestones) ?? [],
    [plan]
  );

  if (!goal || !plan) return <GoalCreation />;

  const mainMilestones = plan.phases.map((phase) => phase.milestones[0]).filter(Boolean);
  const upper = plan.requirements.filter((item) =>
    ["prerequisites", "program-path", "customer-problem", "paid-offer", "market-positioning"].includes(item.id)
  );
  const lower = plan.requirements.filter((item) => !upper.includes(item)).slice(0, 4);
  const selectedRequirement = selection?.kind === "requirement" ? selection.item : undefined;
  const selectedMilestone = selection?.kind === "milestone" ? selection.item : undefined;
  const targetTitle = goal.statement.length > 38 ? `${goal.statement.slice(0, 38)}…` : goal.statement;
  const nextMilestone = milestones.find((milestone) =>
    milestone.tasks.some((task) => task.id === plan.nextAction.id)
  );

  const canvasWidth = 1420;
  const canvasHeight = 720;
  const mainY = 340;
  const mainXs = [90, 330, 570, 810, 1050, 1290];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3">
        <div>
          <h2 className="text-base font-semibold text-[#062e52]">
            {mode === "timeline" ? "Your Career Timeline and Possibilities" : "Your Career Possibilities and Progression"}
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">Explore verified foundations, gaps, alternate routes, and the evidence needed to move forward.</p>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-600">
            Scenario
            <select className="bg-transparent font-semibold text-slate-800 outline-none"><option>Primary plan</option><option>Accelerated</option><option>Lower risk</option></select>
          </label>
          <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-slate-600">Filters</button>
          <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-slate-600">Legend</button>
          <div className="flex overflow-hidden rounded-lg border border-slate-200">
            <button type="button" aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(0.65, value - 0.08))} className="px-3 py-2 hover:bg-slate-50">−</button>
            <span className="border-x border-slate-200 px-3 py-2 font-semibold text-slate-700">{Math.round(zoom * 100)}%</span>
            <button type="button" aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(1.15, value + 0.08))} className="px-3 py-2 hover:bg-slate-50">+</button>
          </div>
          <button type="button" onClick={() => setZoom(0.86)} className="rounded-lg border border-slate-200 px-3 py-2 text-slate-600">Fit map</button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_270px]">
        <div className="min-h-0 overflow-auto bg-white">
          <div className="relative origin-top-left" style={{ width: canvasWidth * zoom, height: canvasHeight * zoom }}>
            <div className="relative" style={{ width: canvasWidth, height: canvasHeight, transform: `scale(${zoom})`, transformOrigin: "top left" }}>
              <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} aria-hidden="true">
                <defs><marker id="arrow-main" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" fill={routeColors.main} /></marker></defs>
                <path d={`M90 ${mainY} H1290`} stroke={routeColors.main} strokeWidth="4" fill="none" markerEnd="url(#arrow-main)" />
                {upper.map((item, index) => {
                  const x = 300 + index * 210;
                  const y = index % 2 === 0 ? 105 : 205;
                  return <path key={item.id} d={`M330 ${mainY} C330 ${y}, ${x - 70} ${y}, ${x} ${y}`} stroke={routeColors.opportunity} strokeWidth="2" fill="none" />;
                })}
                {lower.map((item, index) => {
                  const y = 465 + index * 62;
                  return <path key={item.id} d={`M90 ${mainY} C90 ${y}, 210 ${y}, 300 ${y} H820 C930 ${y}, 950 ${mainY}, 1050 ${mainY}`} stroke={item.status === "missing" ? routeColors.blocker : routeColors.evidence} strokeWidth="2" fill="none" />;
                })}
                <path d={`M1050 ${mainY} C1050 500, 1110 500, 1160 500 H1290`} stroke={routeColors.alternate} strokeWidth="2" fill="none" strokeDasharray="6 5" />
                <path d={`M1050 ${mainY} C1050 600, 1110 600, 1160 600 H1290`} stroke={routeColors.alternate} strokeWidth="2" fill="none" strokeDasharray="6 5" />
                {mode === "timeline" && [0, 1, 2, 3, 4].map((index) => <text key={index} x={mainXs[index]} y="705" fill="#64748b" fontSize="11" textAnchor="middle">Month {index === 0 ? 0 : Math.round((goal.guidance.recommendedTimelineMonths * index) / 4)}</text>)}
              </svg>

              <div className="absolute left-[34px] top-[270px] rounded bg-[#062e52] px-2 py-1 text-[9px] font-semibold text-white">You are here</div>
              <MapNode x={mainXs[0]} y={mainY} title="Today" subtitle="Current evidence and constraints" color={routeColors.navy} icon="today" status="satisfied" selected={false} onClick={() => setSelection(undefined)} />
              {mainMilestones.map((milestone, index) => (
                <MapNode key={milestone.id} x={mainXs[index + 1] ?? mainXs[4]} y={mainY} title={plan.phases[index]?.title ?? milestone.title} subtitle={mode === "timeline" ? `By month ${milestone.targetMonth}` : milestone.outcome} color={routeColors.main} icon={milestone.id} status={milestoneStatus(milestone)} emphasized={milestone.id === nextMilestone?.id} selected={selectedMilestone?.id === milestone.id} onClick={() => setSelection({ kind: "milestone", item: milestone })} />
              ))}
              <MapNode x={mainXs[5]} y={mainY} title={targetTitle} subtitle="Target outcome" color={routeColors.navy} icon="target" status="not_started" selected={selection?.kind === "target"} onClick={() => setSelection({ kind: "target" })} />

              {upper.map((requirement, index) => {
                const x = 300 + index * 210;
                const y = index % 2 === 0 ? 105 : 205;
                return <MapNode key={requirement.id} x={x} y={y} title={requirement.label} subtitle={requirement.description} color={routeColors.opportunity} icon={requirement.id} status={requirement.status} selected={selectedRequirement?.id === requirement.id} onClick={() => setSelection({ kind: "requirement", item: requirement })} />;
              })}
              {lower.map((requirement, index) => {
                const y = 465 + index * 62;
                return <MapNode key={requirement.id} x={300 + index * 185} y={y} title={requirement.label} color={requirementColors[requirement.status]} icon={requirement.id} status={requirement.status} selected={selectedRequirement?.id === requirement.id} onClick={() => setSelection({ kind: "requirement", item: requirement })} />;
              })}

              <MapNode x={1160} y={500} title="Bridge role" subtitle="Lower-risk alternate route" color={routeColors.alternate} icon="relationships" status="partial" selected={false} onClick={() => setSelection({ kind: "target" })} />
              <MapNode x={1160} y={600} title="Pilot client" subtitle="Test value before transition" color={routeColors.alternate} icon="opportunity" status="partial" selected={false} onClick={() => setSelection({ kind: "target" })} />
            </div>
          </div>
        </div>

        <aside className="min-h-0 overflow-y-auto border-l border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">Selected map node</div>
              <h3 className="mt-1 text-base font-semibold text-slate-900">
                {selectedRequirement?.label ?? selectedMilestone?.title ?? (selection?.kind === "target" ? targetTitle : "Build proof")}
              </h3>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 text-blue-600"><span className="h-5 w-5"><NodeIcon type={selectedRequirement?.id ?? selectedMilestone?.id ?? "proof"} /></span></span>
          </div>
          <div className="mt-4"><StatusLabel status={selectedRequirement?.status ?? selectedMilestone?.status ?? "in_progress"} /></div>
          <section className="mt-5 border-t border-slate-200 pt-4">
            <h4 className="text-xs font-semibold text-slate-800">About this node</h4>
            <p className="mt-2 text-[11px] leading-5 text-slate-500">
              {selectedRequirement?.description ?? selectedMilestone?.outcome ?? "Create and collect credible evidence that moves this goal closer to a safe, informed transition."}
            </p>
          </section>
          <section className="mt-5 border-t border-slate-200 pt-4">
            <h4 className="text-xs font-semibold text-slate-800">Evidence</h4>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-blue-600" style={{ width: `${selectedRequirement ? Math.max(12, selectedRequirement.evidenceIds.length * 30) : plan.evidenceCoverage}%` }} /></div>
            <div className="mt-3 space-y-2 text-[11px] text-slate-500">
              {(selectedRequirement?.evidenceIds ?? []).length ? selectedRequirement?.evidenceIds.map((id) => <div key={id} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" />{plan.evidence.find((item) => item.id === id)?.claim ?? "Supporting evidence"}</div>) : <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full border border-rose-400" />Additional evidence required</div>}
            </div>
          </section>
          <section className="mt-5 border-t border-slate-200 pt-4">
            <h4 className="text-xs font-semibold text-slate-800">Recommended actions</h4>
            <div className="mt-3 space-y-2">
              {(selectedMilestone?.tasks ?? (nextMilestone?.tasks ?? [plan.nextAction])).map((task) => <div key={task.id} className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] leading-4 text-slate-600">{task.title}<span className="mt-1 block text-[9px] uppercase tracking-wide text-slate-400">{task.owner} · {task.estimatedHours}h</span></div>)}
            </div>
          </section>
          <button type="button" className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500">View recommended actions</button>
        </aside>
      </div>
    </div>
  );
}
