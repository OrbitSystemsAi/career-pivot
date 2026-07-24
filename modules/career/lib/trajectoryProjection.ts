import type { EvidenceBackedPlan } from "@/core/planning/planningTypes";
import type { UserGoal } from "@/core/user/userTypes";

export type TrajectoryPoint = {
  month: number;
  value: number;
  low: number;
  high: number;
  label: string;
  detail: string;
  status: "actual" | "projected" | "target";
};

export type CareerTrajectory = {
  current: TrajectoryPoint[];
  target: TrajectoryPoint[];
  bridge: TrajectoryPoint[];
  horizonMonths: number;
  currentReadiness: number;
  targetReadiness: number;
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function point(
  month: number,
  value: number,
  label: string,
  detail: string,
  uncertainty: number,
  status: TrajectoryPoint["status"] = "projected"
): TrajectoryPoint {
  return {
    month,
    value: clamp(value),
    low: clamp(value - uncertainty),
    high: clamp(value + uncertainty),
    label,
    detail,
    status,
  };
}

export function buildCareerTrajectory(
  plan: EvidenceBackedPlan,
  goal: UserGoal
): CareerTrajectory {
  const horizonMonths = Math.max(6, goal.guidance.recommendedTimelineMonths);
  const currentReadiness = plan.readiness;
  const requiredCount = Math.max(
    1,
    plan.requirements.filter((item) => item.importance === "required").length
  );
  const unresolvedRequired = plan.requirements.filter(
    (item) => item.importance === "required" && item.status !== "satisfied"
  ).length;
  const targetReadiness = clamp(
    Math.max(82, 100 - (unresolvedRequired / requiredCount) * 8)
  );
  const organicGain = Math.min(16, Math.max(6, plan.evidenceCoverage / 7));

  const current = [
    point(0, currentReadiness, "Today", "Current evidence-backed readiness.", 0, "actual"),
    point(
      Math.round(horizonMonths * 0.5),
      currentReadiness + organicGain * 0.55,
      "Current path",
      "Expected incremental progress without the focused transition plan.",
      5
    ),
    point(
      horizonMonths,
      currentReadiness + organicGain,
      "Current trajectory",
      "Planning baseline if progress remains incremental.",
      8
    ),
  ];

  const target = [
    point(0, currentReadiness, "Today", "Current evidence-backed readiness.", 0, "actual"),
    ...plan.phases.map((phase, index) => {
      const progress = (index + 1) / plan.phases.length;
      const readiness =
        currentReadiness + (targetReadiness - currentReadiness) * progress;
      return point(
        Math.min(horizonMonths, phase.endMonth),
        readiness,
        phase.title,
        phase.purpose,
        4 + index * 3,
        index === plan.phases.length - 1 ? "target" : "projected"
      );
    }),
  ];

  const bridgeEnd = clamp(
    currentReadiness + (targetReadiness - currentReadiness) * 0.82
  );
  const bridge = [
    point(0, currentReadiness, "Today", "Current evidence-backed readiness.", 0, "actual"),
    point(
      Math.round(horizonMonths * 0.42),
      currentReadiness + (bridgeEnd - currentReadiness) * 0.48,
      "Bridge role",
      "Preserve income while building adjacent experience and proof.",
      4
    ),
    point(
      horizonMonths,
      bridgeEnd,
      "Lower-risk position",
      "A safer intermediate state that keeps the primary target available.",
      6
    ),
  ];

  return {
    current,
    target,
    bridge,
    horizonMonths,
    currentReadiness,
    targetReadiness,
  };
}
