"use client";

import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";

export function HomeIdentityPanel() {
  const { user } = useUser();
  return <PanelCard title="Signature"><div className="text-xs leading-5 text-slate-500">{user.headline || "Add a profile headline."}</div></PanelCard>;
}

export function HomeDirectionPanel() {
  const { user } = useUser();
  return <PanelCard title="Direction"><div className="text-xs leading-5 text-slate-500">{user.goals[0]?.statement || "Define your next direction."}</div></PanelCard>;
}

export function HomeProofPanel() {
  const { user } = useUser();
  return <PanelCard title="Proof"><div className="text-3xl font-semibold text-[#173a46]">{user.planningProgress.submittedEvidence.length}<div className="mt-1 text-xs font-normal text-slate-500">verified proof points</div></div></PanelCard>;
}

export function HomeStrengthPanel() {
  const { user } = useUser();
  return <PanelCard title="Strengths"><div className="text-xs leading-5 text-slate-600">{user.skills.slice(0, 5).join(" · ") || "Add strengths in Profile."}</div></PanelCard>;
}

export function HomeMomentumPanel() {
  const { user } = useUser();
  return <PanelCard title="Momentum"><div className="text-3xl font-semibold text-[#173a46]">{user.planningProgress.submittedEvidence.length + user.opportunityProgress.savedOpportunityIds.length}</div></PanelCard>;
}

export function HomeNextPanel() {
  const { user } = useUser();
  return <PanelCard title="Next"><div className="text-xs text-slate-600">{user.goals[0] ? "Advance the next evidence-backed milestone." : "Create your first flexible goal."}</div></PanelCard>;
}
