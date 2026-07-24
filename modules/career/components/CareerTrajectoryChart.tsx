"use client";

import { useMemo, useState } from "react";
import { useUser } from "@/core/user/UserProvider";
import { generateEvidenceBackedPlan } from "@/core/planning/roadmapEngine";
import {
  buildCareerTrajectory,
  type TrajectoryPoint,
} from "@/modules/career/lib/trajectoryProjection";
import GoalCreation from "./GoalCreation";

type SeriesKey = "target" | "bridge" | "current";
type SelectedPoint = { series: SeriesKey; point: TrajectoryPoint };

const series = {
  target: { label: "Target trajectory", color: "#0f4f80" },
  bridge: { label: "Bridge path", color: "#168391" },
  current: { label: "Current trajectory", color: "#334b60" },
};

function formatIndex(value: number) {
  return String(Math.round(value)).padStart(2, "0");
}

export default function CareerTrajectoryChart() {
  const { user, activeResumeId } = useUser();
  const [visibleSeries, setVisibleSeries] = useState<Record<SeriesKey, boolean>>({
    target: true,
    bridge: true,
    current: true,
  });
  const [selected, setSelected] = useState<SelectedPoint>();
  const goal = user.goals[0];
  const plan = generateEvidenceBackedPlan(user, activeResumeId);
  const trajectory = useMemo(
    () => (plan && goal ? buildCareerTrajectory(plan, goal) : undefined),
    [goal, plan]
  );

  if (!goal || !plan || !trajectory) return <GoalCreation />;

  const width = 1120;
  const height = 560;
  const margin = { top: 36, right: 44, bottom: 58, left: 66 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const x = (month: number) =>
    margin.left + (month / trajectory.horizonMonths) * plotWidth;
  const y = (value: number) =>
    margin.top + ((100 - value) / 100) * plotHeight;
  const linePath = (points: TrajectoryPoint[]) =>
    points
      .map((point, index) => `${index === 0 ? "M" : "L"}${x(point.month)} ${y(point.value)}`)
      .join(" ");
  const bandPath = (points: TrajectoryPoint[]) => {
    const upper = points.map((point) => `${x(point.month)} ${y(point.high)}`);
    const lower = [...points]
      .reverse()
      .map((point) => `${x(point.month)} ${y(point.low)}`);
    return `M${upper.join(" L")} L${lower.join(" L")} Z`;
  };
  const ticks = [0, 25, 50, 75, 100];
  const monthTicks = Array.from({ length: 5 }, (_, index) =>
    Math.round((trajectory.horizonMonths * index) / 4)
  );
  const gap = trajectory.targetReadiness - trajectory.currentReadiness;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white text-[#102f39]">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#c8d8dc] px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Career Trajectory</h2>
          <p className="mt-1 text-xs text-slate-500">
            Evidence-backed readiness projection for {goal.statement}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(series) as SeriesKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() =>
                setVisibleSeries((current) => ({
                  ...current,
                  [key]: !current[key],
                }))
              }
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-semibold transition ${
                visibleSeries[key]
                  ? "border-[#b7cbd0] bg-[#eef5f6] text-[#173a46]"
                  : "border-slate-200 text-slate-400"
              }`}
            >
              <span
                className="h-2 w-5 rounded-full"
                style={{ backgroundColor: series[key].color }}
              />
              {series[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-h-0 overflow-auto px-5 py-4">
          <div className="grid grid-cols-4 gap-px overflow-hidden rounded-xl border border-[#c8d8dc] bg-[#c8d8dc]">
            <div className="bg-white px-4 py-3">
              <div className="text-xl font-semibold">{formatIndex(trajectory.currentReadiness)}</div>
              <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">Current index</div>
            </div>
            <div className="bg-white px-4 py-3">
              <div className="text-xl font-semibold text-[#0f4f80]">{formatIndex(trajectory.targetReadiness)}</div>
              <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">Target threshold</div>
            </div>
            <div className="bg-white px-4 py-3">
              <div className="text-xl font-semibold text-[#f28c28]">+{gap}</div>
              <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">Readiness gap</div>
            </div>
            <div className="bg-white px-4 py-3">
              <div className="text-xl font-semibold">{trajectory.horizonMonths} mo</div>
              <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">Planning horizon</div>
            </div>
          </div>

          <div className="mt-4 min-w-[760px] rounded-xl border border-[#c8d8dc] bg-white p-3">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-labelledby="trajectory-chart-title trajectory-chart-desc">
              <title id="trajectory-chart-title">Career readiness trajectory chart</title>
              <desc id="trajectory-chart-desc">Comparison of current, target, and bridge readiness paths across the selected planning horizon.</desc>
              {ticks.map((tick) => (
                <g key={tick}>
                  <line x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} stroke="#dce7e9" strokeWidth="1" />
                  <text x={margin.left - 12} y={y(tick) + 4} textAnchor="end" fill="#607984" fontSize="11">{tick}</text>
                </g>
              ))}
              {monthTicks.map((tick) => (
                <g key={tick}>
                  <line x1={x(tick)} x2={x(tick)} y1={margin.top} y2={height - margin.bottom} stroke="#e8eff0" strokeWidth="1" />
                  <text x={x(tick)} y={height - 24} textAnchor="middle" fill="#607984" fontSize="11">Month {tick}</text>
                </g>
              ))}
              <text x="18" y={margin.top + plotHeight / 2} fill="#607984" fontSize="11" textAnchor="middle" transform={`rotate(-90 18 ${margin.top + plotHeight / 2})`}>Evidence-backed readiness index</text>

              {visibleSeries.target && <path d={bandPath(trajectory.target)} fill="#168391" opacity="0.08" />}
              {(Object.keys(series) as SeriesKey[]).map((key) => {
                if (!visibleSeries[key]) return null;
                const points = trajectory[key];
                return (
                  <g key={key}>
                    <path d={linePath(points)} fill="none" stroke={series[key].color} strokeWidth={key === "target" ? 4 : 2.5} strokeDasharray={key === "bridge" ? "8 6" : undefined} />
                    {points.map((point) => {
                      const active = selected?.series === key && selected.point.month === point.month;
                      return (
                        <g key={`${key}-${point.month}`}>
                          <circle cx={x(point.month)} cy={y(point.value)} r={active ? 9 : 6} fill="white" stroke={active ? "#f28c28" : series[key].color} strokeWidth={active ? 4 : 3} />
                          {key === "target" && point.month > 0 && <text x={x(point.month)} y={y(point.value) - 16} textAnchor="middle" fill="#173a46" fontSize="10" fontWeight="600">{point.label}</text>}
                          <foreignObject x={x(point.month) - 14} y={y(point.value) - 14} width="28" height="28">
                            <button
                              type="button"
                              aria-label={`${series[key].label}, ${point.label}, month ${point.month}, readiness ${point.value}`}
                              onClick={() => setSelected({ series: key, point })}
                              className="h-7 w-7 rounded-full bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                          </foreignObject>
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              <line x1={margin.left} x2={width - margin.right} y1={y(trajectory.targetReadiness)} y2={y(trajectory.targetReadiness)} stroke="#168391" strokeWidth="1" strokeDasharray="3 5" opacity="0.8" />
              <text x={width - margin.right} y={y(trajectory.targetReadiness) - 8} textAnchor="end" fill="#168391" fontSize="10">Target readiness threshold</text>
            </svg>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-[10px] text-slate-500">
            <span>Planning projection · recalculates as evidence and constraints change</span>
            <span>Not a probability, salary forecast, or guarantee</span>
          </div>
        </div>

        <aside className="min-h-0 overflow-y-auto border-l border-[#c8d8dc] bg-white p-5">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-[#168391]">Selected point</div>
          <h3 className="mt-2 text-lg font-semibold">
            {selected?.point.label ?? "Target trajectory"}
          </h3>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-4xl font-semibold tabular-nums">
              {selected?.point.value ?? trajectory.targetReadiness}
            </span>
            <span className="pb-1 text-xs text-slate-500">readiness index</span>
          </div>
          <div className="mt-5 border-t border-slate-200 pt-4">
            <div className="text-xs font-semibold text-slate-700">Interpretation</div>
            <p className="mt-2 text-xs leading-6 text-slate-500">
              {selected?.point.detail ?? "The focused target path closes documented gaps faster than the current trajectory, while the bridge path trades speed for lower transition risk."}
            </p>
          </div>
          <div className="mt-5 border-t border-slate-200 pt-4">
            <div className="text-xs font-semibold text-slate-700">Range</div>
            <div className="mt-3 flex justify-between text-xs text-slate-500">
              <span>Low {selected?.point.low ?? trajectory.targetReadiness - 8}</span>
              <span>High {selected?.point.high ?? Math.min(100, trajectory.targetReadiness + 4)}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full bg-[#0f4f80]" style={{ width: `${selected?.point.value ?? trajectory.targetReadiness}%` }} />
            </div>
          </div>
          <div className="mt-5 border-t border-slate-200 pt-4">
            <div className="text-xs font-semibold text-slate-700">What changes the line</div>
            <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-500">
              <li>• New verified evidence</li>
              <li>• Completed required milestones</li>
              <li>• Changed time or financial constraints</li>
              <li>• Revised target or planning horizon</li>
            </ul>
          </div>
          <button type="button" className="mt-6 w-full rounded-lg bg-[#126174] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#174f5a]">Open evidence-backed plan</button>
        </aside>
      </div>
    </div>
  );
}
