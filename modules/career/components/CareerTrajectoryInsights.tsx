"use client";

import PanelCard from "@/core/ui/PanelCard";
import { generateEvidenceBackedPlan } from "@/core/planning/roadmapEngine";
import { useUser } from "@/core/user/UserProvider";

export function CareerAssumptionsPanel() {
  const { user } = useUser();
  const assumptions = user.goals[0]?.guidance.assumptions ?? [];
  return (
    <PanelCard title="Assumptions">
      <ul className="space-y-2 text-xs leading-5 text-slate-500">
        {(assumptions.length ? assumptions : ["Goal requirements still need validation."]).slice(0, 3).map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </PanelCard>
  );
}

export function CareerRiskSignalsPanel() {
  const { user, activeResumeId } = useUser();
  const plan = generateEvidenceBackedPlan(user, activeResumeId);
  const missing = plan?.requirements.filter((requirement) => requirement.status === "missing" || requirement.status === "unknown").length ?? 0;
  return (
    <PanelCard title="Risk signals">
      <div className="text-3xl font-semibold text-orange-300">{missing}</div>
      <div className="mt-2 text-xs leading-5 text-slate-500">requirements lack sufficient evidence</div>
    </PanelCard>
  );
}

export function CareerDecisionPanel() {
  const { user, activeResumeId } = useUser();
  const plan = generateEvidenceBackedPlan(user, activeResumeId);
  return (
    <PanelCard title="Decision checkpoint">
      <div className="text-xs leading-5 text-slate-500">
        {plan?.nextAction.title ?? "Create a goal to define the next decision checkpoint."}
      </div>
      {plan?.nextAction.estimatedHours ? <div className="mt-3 text-[10px] uppercase tracking-wide text-orange-300">{plan.nextAction.estimatedHours} hours estimated</div> : null}
    </PanelCard>
  );
}
