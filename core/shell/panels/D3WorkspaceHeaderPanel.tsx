"use client";

import { getActiveModule } from "@/core/moduleEngine/getActiveModule";
import { useOSState } from "@/core/state/OSStateProvider";
import { useUser } from "@/core/user/UserProvider";
import { getCareerIntelligence } from "@/modules/career/lib/careerIntelligence";
import { getResumeIntelligence } from "@/modules/resume/lib/resumeIntelligence";
import { getNetworkIntelligence } from "@/modules/network/lib/networkIntelligence";
import { getAgentIntelligence } from "@/modules/agents/lib/agentIntelligence";
import { getCareerOpportunityIntelligence } from "@/core/opportunities/careerOpportunityEngine";

export default function D3WorkspaceHeaderPanel() {
  const { activeModule } = useOSState();
  const { user, activeResumeId } = useUser();
  const activeModuleDefinition = getActiveModule(activeModule);
  const resumeIntelligence = getResumeIntelligence(user, activeResumeId);
  const careerIntelligence = getCareerIntelligence(user, activeResumeId);
  const networkIntelligence = getNetworkIntelligence(user);
  const agentIntelligence = getAgentIntelligence(user);
  const careerOpportunities = getCareerOpportunityIntelligence(
    user,
    activeResumeId
  );
  const currentOpportunityIds = new Set(
    careerOpportunities.paths.flatMap((path) => path.jobs.map((job) => job.id))
  );
  const savedCareerOpportunityCount =
    user.opportunityProgress.savedOpportunityIds.filter((id) =>
      currentOpportunityIds.has(id)
    ).length;
  const metrics =
    activeModule === "resume" && resumeIntelligence.hasResume
      ? [
          {
            label: "Resume Score",
            value: `${resumeIntelligence.resumeScore}%`,
          },
          {
            label: "ATS Match",
            value: `${resumeIntelligence.atsScore}%`,
          },
          {
            label: "Keywords",
            value: String(resumeIntelligence.detectedKeywords.length),
          },
          {
            label: "Gaps",
            value: String(resumeIntelligence.gapCount),
          },
        ]
      : activeModule === "career" && careerIntelligence.hasResume
        ? [
            {
              label: "Current Career",
              value: `${careerIntelligence.currentCareer?.match ?? 0}%`,
            },
            {
              label: "Selected Career",
              value: `${careerIntelligence.selectedCareer?.match ?? 0}%`,
            },
            {
              label: "Next Titles",
              value: String(careerIntelligence.nextTitles.length),
            },
            {
              label: "Resume Skills",
              value: String(careerIntelligence.skills.length),
            },
          ]
        : activeModule === "career" && user.goals.length > 0
          ? [
              { label: "Active Goals", value: String(user.goals.length) },
              {
                label: "Planning Range",
                value: `${user.goals[0].guidance.recommendedTimelineMonths} mo`,
              },
              {
                label: "Success Criteria",
                value: String(
                  user.goals[0].successCriteria.filter(
                    (criterion) => criterion.accepted
                  ).length
                ),
              },
              {
                label: "Feasibility",
                value: user.goals[0].guidance.rating.replaceAll("_", " "),
              },
          ]
        : activeModule === "opportunity"
          ? [
              {
                label: "Career Paths",
                value: String(careerOpportunities.paths.length),
              },
              {
                label: "Saved",
                value: String(savedCareerOpportunityCount),
              },
              {
                label: "Matched Jobs",
                value: String(careerOpportunities.totalJobs),
              },
              {
                label: "Best Fit",
                value:
                  careerOpportunities.bestScore === null
                    ? "—"
                    : `${careerOpportunities.bestScore}%`,
              },
            ]
        : activeModule === "network" && networkIntelligence.hasConnectedSource
          ? [
              {
                label: "Network Score",
                value: `${networkIntelligence.score}%`,
              },
              {
                label: "Warm Paths",
                value: String(networkIntelligence.warmPaths),
              },
              {
                label: "Recruiters",
                value: String(networkIntelligence.recruiters),
              },
              {
                label: "Companies",
                value: String(networkIntelligence.targetCompanies),
              },
            ]
        : activeModule === "agents"
          ? [
              {
                label: "Active Agents",
                value: String(agentIntelligence.activeAgents),
              },
              {
                label: "Tasks Run",
                value: String(agentIntelligence.completedTasks),
              },
              {
                label: "Opportunities",
                value: String(agentIntelligence.opportunitiesFound),
              },
              {
                label: "Time Saved",
                value: `${Math.round(agentIntelligence.timeSavedMinutes / 60)}h`,
              },
            ]
        : activeModuleDefinition.metrics;
  const showUploadHeader =
    activeModule === "resume" && !resumeIntelligence.hasResume;
  const showNetworkConnectionHeader =
    activeModule === "network" && !networkIntelligence.hasConnectedSource;

  return (
    <div className="grid h-20 grid-cols-[56px_1fr_1fr_1fr_1fr_56px] border-b border-[#416b75] bg-[linear-gradient(90deg,#214f5b,#2d6975)] text-white">
      <button className="flex items-center justify-center border-r border-[#6f9299]/45 text-xl font-medium text-[#d3e1e4] hover:bg-[#275a65] hover:text-white">
        ‹
      </button>

      {showUploadHeader || showNetworkConnectionHeader ? (
        <div className="col-span-4 flex items-center justify-center border-r border-[#6f9299]/45 text-sm text-[#d3e1e4]">
          {showNetworkConnectionHeader
            ? "No network source connected"
            : "Please upload to get started"}
        </div>
      ) : (
        metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center justify-center border-r border-[#6f9299]/45 hover:bg-[#275a65]"
          >
            <div>
              <div className="flex items-baseline gap-2">
                <div className="text-lg font-bold text-white">
                  {metric.value}
                </div>

                {metric.change && (
                  <div className="text-[11px] font-medium text-orange-300">
                    {metric.change}
                  </div>
                )}
              </div>

              <div className="text-xs text-[#c6d7da]">{metric.label}</div>
            </div>
          </div>
        ))
      )}

      <button className="flex items-center justify-center text-xl font-medium text-[#d3e1e4] hover:bg-[#275a65] hover:text-white">
        ›
      </button>
    </div>
  );
}
