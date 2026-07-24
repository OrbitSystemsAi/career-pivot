"use client";

import { getCareerOpportunityIntelligence } from "@/core/opportunities/careerOpportunityEngine";
import PanelCard from "@/core/ui/PanelCard";
import { useUser } from "@/core/user/UserProvider";

export function OpportunityGoalPanel() {
  const { user, activeResumeId } = useUser();
  const opportunity = getCareerOpportunityIntelligence(user, activeResumeId);

  return (
    <PanelCard title="Career Paths">
      <div className="space-y-2 p-3">
        {opportunity.paths.length ? (
          opportunity.paths.map((path) => (
            <div
              key={path.id}
              className="rounded-xl border border-[#d6e8ea] bg-white px-3 py-2"
            >
              <div className="text-[10px] uppercase tracking-wide text-slate-400">
                Choice {path.choiceNumber}
              </div>
              <div className="mt-1 text-xs font-semibold text-[#173a46]">
                {path.label}
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs leading-5 text-slate-500">
            {opportunity.prerequisites.filter((item) => !item.complete).length} setup
            {opportunity.prerequisites.filter((item) => !item.complete).length === 1
              ? " requirement remains."
              : " requirements remain."}
          </div>
        )}
      </div>
    </PanelCard>
  );
}

export function OpportunityShortlistPanel() {
  const { user, activeResumeId } = useUser();
  const opportunity = getCareerOpportunityIntelligence(user, activeResumeId);
  const currentOpportunityIds = new Set(
    opportunity.paths.flatMap((path) => path.jobs.map((job) => job.id))
  );
  const savedCount = user.opportunityProgress.savedOpportunityIds.filter((id) =>
    currentOpportunityIds.has(id)
  ).length;
  return (
    <PanelCard title="Shortlist">
      <div className="p-3 text-2xl font-semibold text-slate-900">
        {savedCount}
        <div className="mt-1 text-xs font-normal text-slate-500">
          saved jobs across all paths
        </div>
      </div>
    </PanelCard>
  );
}

export function OpportunitySourcePanel() {
  const { user, activeResumeId } = useUser();
  const opportunity = getCareerOpportunityIntelligence(user, activeResumeId);

  return (
    <PanelCard title="Source Quality">
      <div className="p-3 text-xs leading-5 text-amber-700">
        {opportunity.isReady
          ? "Current jobs are planning previews for scoring and workflow validation. Live job-provider verification is not connected yet."
          : "Complete all three Opportunity requirements before job matching begins."}
      </div>
    </PanelCard>
  );
}

export function OpportunityCountPanel() {
  const { user, activeResumeId } = useUser();
  const opportunity = getCareerOpportunityIntelligence(user, activeResumeId);
  return (
    <PanelCard title="Matched Jobs">
      <div className="p-3 text-2xl font-semibold text-slate-900">
        {opportunity.totalJobs}
        <div className="mt-1 text-xs font-normal text-slate-500">
          across {opportunity.paths.length} career path
          {opportunity.paths.length === 1 ? "" : "s"}
        </div>
      </div>
    </PanelCard>
  );
}

export function OpportunityActionPanel() {
  return (
    <PanelCard title="Next Action">
      <div className="p-3 text-xs leading-5 text-slate-600">
        Compare the score breakdown, strengthen missing evidence, and shortlist
        only the jobs worth tailoring a resume toward.
      </div>
    </PanelCard>
  );
}

export function OpportunitySafetyPanel() {
  return (
    <PanelCard title="Before Acting">
      <div className="p-3 text-xs leading-5 text-slate-600">
        Verify the employer, posting URL, compensation, location, eligibility,
        and closing date before applying.
      </div>
    </PanelCard>
  );
}
