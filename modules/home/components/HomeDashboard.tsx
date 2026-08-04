"use client";

import { useMemo } from "react";
import { generateEvidenceBackedPlan } from "@/core/planning/roadmapEngine";
import { useAuth } from "@/core/auth/AuthProvider";
import { buildStructuredResume } from "@/core/resumeParsing/buildStructuredResume";
import type { ResumeExperience } from "@/core/resumeParsing/resumeStructureTypes";
import { useOSState } from "@/core/state/OSStateProvider";
import { useUser } from "@/core/user/UserProvider";
import type {
  OnboardingGoalDirection,
  OnboardingPrimaryIntent,
} from "@/core/user/userTypes";
import { getIndustryExperienceData } from "@/modules/home/lib/industryExperience";
import { getProfileIntelligence } from "@/modules/home/lib/profileIntelligence";
import { deriveOnnFeedSignals } from "@/modules/home/lib/onnFeedSignals";
import { getResumeIntelligence } from "@/modules/resume/lib/resumeIntelligence";
import CoreStrengthsTile from "./CoreStrengthsTile";
import ActiveDirectionTile from "./ActiveDirectionTile";
import ExperienceTimelineTile from "./ExperienceTimelineTile";
import HighlightsTile from "./HighlightsTile";
import HomeHeaderMenu from "./HomeHeaderMenu";
import HomeLayoutDesigner from "./HomeLayoutDesigner";
import HomeMagazine from "./HomeMagazine";
import UserPostingEditor from "./UserPostingEditor";
import IndustriesVennTile from "./IndustriesVennTile";

type HighlightTileProps = {
  className?: string;
  label: string;
  value: string | number;
  detail?: string;
  tone: "navy" | "cyan" | "mist" | "cobalt" | "teal" | "pale" | "slate" | "aqua";
};

const tileTones = {
  navy: "border-[#2b6874] bg-[linear-gradient(145deg,#0f3040,#164b68)] text-white [&_.tile-label]:text-[#b9d0d5] [&_.tile-value]:text-white [&_.tile-detail]:text-[#d3e1e4]",
  cyan: "border-[#69c8e8] bg-[linear-gradient(145deg,#35afe6,#66d0f0)] text-[#0f3040] [&_.tile-label]:text-[#164b68] [&_.tile-value]:text-[#0f3040] [&_.tile-detail]:text-[#164b68]",
  mist: "border-[#afd2e7] bg-[linear-gradient(145deg,#eef8fd,#cfeafb)] text-[#173a46] [&_.tile-label]:text-[#68849a] [&_.tile-value]:text-[#173a46] [&_.tile-detail]:text-[#526b7f]",
  cobalt: "border-[#3469cf] bg-[linear-gradient(145deg,#174bb9,#246bd7)] text-white [&_.tile-label]:text-[#d9e7ff] [&_.tile-value]:text-white [&_.tile-detail]:text-[#edf4ff]",
  teal: "border-[#238aa5] bg-[linear-gradient(145deg,#117188,#229bb5)] text-white [&_.tile-label]:text-[#d4f3f7] [&_.tile-value]:text-white [&_.tile-detail]:text-[#e7f8fa]",
  pale: "border-[#c8dfe9] bg-[linear-gradient(145deg,#f8fcfe,#e3f3f9)] text-[#173a46] [&_.tile-label]:text-[#6d8799] [&_.tile-value]:text-[#173a46] [&_.tile-detail]:text-[#526b7f]",
  slate: "border-[#2f6196] bg-[linear-gradient(145deg,#173f70,#2f68a8)] text-white [&_.tile-label]:text-[#d8e5f5] [&_.tile-value]:text-white [&_.tile-detail]:text-[#edf4fb]",
  aqua: "border-[#53c7dc] bg-[linear-gradient(145deg,#38c2dc,#72dcec)] text-[#123743] [&_.tile-label]:text-[#235f70] [&_.tile-value]:text-[#123743] [&_.tile-detail]:text-[#235f70]",
} as const;

const goalDirectionLabels: Record<OnboardingGoalDirection, string> = {
  pursue_new_title: "Pursue a new title",
  find_better_job: "Find a better job",
  change_careers: "Change careers",
  return_to_work: "Return to work",
  work_from_home: "Work from home",
  work_remote: "Work remotely",
  work_abroad: "Work from another country",
  relocate: "Relocate",
  start_business: "Start a business",
  grow_business: "Grow my current business",
  build_multiple_businesses: "Build multiple businesses",
  independent_work: "Work independently",
  start_family: "Start or grow a family",
  become_stay_at_home_parent: "Become a stay-at-home parent",
  work_around_caregiving: "Work around caregiving",
  create_more_life_space: "Create more space for life",
  explore_possibilities: "Explore before deciding",
};

const legacyIntentLabels: Record<OnboardingPrimaryIntent, string> = {
  find_job: "Find a better job",
  change_career: "Change careers",
  build_business: "Build something of my own",
  explore: "Explore what is possible",
  reshape_life_work: "Reshape life and work",
};

function normalizedExperienceValue(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function isPlaceholderTitle(value: string) {
  return /^(?:role|position|job|title)$/i.test(value.trim());
}

function mergeResumeExperience(
  resumeRoles: ResumeExperience[],
  industryHistory: {
    id: string;
    title: string;
    company: string;
    startDate?: string;
    endDate?: string;
  }[],
) {
  const merged: ResumeExperience[] = [];

  const addOrMerge = (candidate: ResumeExperience) => {
    const companyKey = normalizedExperienceValue(candidate.company);
    const titleKey = normalizedExperienceValue(candidate.title);
    const matchIndex = merged.findIndex((existing) => {
      if (existing.id === candidate.id) return true;
      if (normalizedExperienceValue(existing.company) !== companyKey) return false;

      const existingTitleKey = normalizedExperienceValue(existing.title);
      return (
        existingTitleKey === titleKey ||
        isPlaceholderTitle(existing.title) ||
        isPlaceholderTitle(candidate.title)
      );
    });

    if (matchIndex < 0) {
      merged.push(candidate);
      return;
    }

    const existing = merged[matchIndex];
    merged[matchIndex] = {
      ...existing,
      ...candidate,
      id: existing.id || candidate.id,
      title:
        isPlaceholderTitle(candidate.title) && !isPlaceholderTitle(existing.title)
          ? existing.title
          : candidate.title || existing.title,
      company: candidate.company || existing.company,
      startDate: candidate.startDate || existing.startDate,
      endDate: candidate.endDate || existing.endDate,
      bullets: candidate.bullets.length > 0 ? candidate.bullets : existing.bullets,
      rawLines: candidate.rawLines.length > 0 ? candidate.rawLines : existing.rawLines,
    };
  };

  resumeRoles.forEach(addOrMerge);
  industryHistory.forEach((job) =>
    addOrMerge({
      id: job.id,
      title: job.title,
      company: job.company,
      startDate: job.startDate,
      endDate: job.endDate,
      bullets: [],
      rawLines: [],
    }),
  );

  return merged;
}

function HighlightTile({
  className = "",
  label,
  value,
  detail,
  tone,
}: HighlightTileProps) {
  const editorialPhrases = detail
    ? detail
        .split(/\s*[·|•]\s*/)
        .flatMap((phrase) => {
          const words = phrase.trim().split(/\s+/).filter(Boolean);

          if (words.length <= 3) {
            return [words.join(" ")];
          }

          return words.reduce<string[]>((groups, word) => {
            const lastGroup = groups.at(-1);

            if (!lastGroup || lastGroup.split(" ").length >= 2) {
              groups.push(word);
            } else {
              groups[groups.length - 1] = `${lastGroup} ${word}`;
            }

            return groups;
          }, []);
        })
        .filter(Boolean)
        .slice(0, 7)
    : [];
  const phraseStyles = [
    "text-[clamp(1rem,1.35vw,1.35rem)] font-semibold",
    "text-[clamp(.72rem,.85vw,.9rem)] font-medium uppercase tracking-[.08em]",
    "text-[clamp(1.15rem,1.8vw,1.8rem)] font-semibold tracking-[-.04em]",
    "text-[clamp(.75rem,1vw,1rem)] font-medium",
    "text-[clamp(.95rem,1.25vw,1.25rem)] font-semibold",
    "text-[clamp(.68rem,.78vw,.8rem)] font-medium uppercase tracking-[.1em]",
    "text-[clamp(.85rem,1.05vw,1.05rem)] font-medium",
  ];

  return (
    <article
      className={`relative flex min-h-36 flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-sm ${tileTones[tone]} ${className}`}
    >
      <div className="tile-label relative z-10 text-[10px] font-semibold uppercase tracking-[0.2em]">
        {label}
      </div>
      <div className="relative z-10 mt-7">
        <div className="tile-value text-[clamp(3.6rem,6vw,7rem)] font-semibold leading-[.76] tracking-[-0.085em]">
          {value}
        </div>
        {detail ? (
          <div
            aria-label={detail}
            className="tile-detail mt-5 flex max-w-[32rem] flex-wrap items-baseline gap-x-2.5 gap-y-1 leading-[.92]"
          >
            {editorialPhrases.map((phrase, index) => (
              <span
                aria-hidden="true"
                className={`${phraseStyles[index % phraseStyles.length]} ${
                  index === 2 ? "text-[#ff7a00]" : ""
                }`}
                key={`${phrase}-${index}`}
              >
                {phrase}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

type ExperienceTileGroupProps = {
  companyCount: number;
  hasResume: boolean;
  roles: ResumeExperience[];
  roleCount: number;
  onSaveRoles: (roles: ResumeExperience[]) => void;
  onSaveStrengths: (strengths: string[]) => void;
  strengths: string[];
};

function ExperienceTileGroup({
  companyCount,
  hasResume,
  roles,
  roleCount,
  onSaveRoles,
  onSaveStrengths,
  strengths,
}: ExperienceTileGroupProps) {
  return (
    <div className="grid min-h-[19rem] min-w-0 gap-4 sm:col-span-2 sm:row-span-2 sm:grid-rows-[minmax(12rem,1fr)_minmax(0,2fr)]">
      <ExperienceTimelineTile
        hasResume={hasResume}
        roles={roles}
        onSaveRoles={onSaveRoles}
      />

      <div className="grid min-h-0 grid-cols-2 gap-4">
        <CoreStrengthsTile
          onSave={onSaveStrengths}
          strengths={strengths}
        />
        <HighlightTile
          className="min-h-0"
          detail={
            hasResume
              ? `${companyCount} ${companyCount === 1 ? "organization" : "organizations"}`
              : "Upload a resume to map"
          }
          label="Career Arc"
          tone="mist"
          value={hasResume ? roleCount : "—"}
        />
      </div>
    </div>
  );
}

export default function HomeDashboard() {
  const { user, activeResumeId, updateProfile, updateResumeExperience } = useUser();
  const { reopenOnboarding } = useAuth();
  const { activeView, homeLayoutId, setActiveView } = useOSState();
  const plan = useMemo(
    () => generateEvidenceBackedPlan(user, activeResumeId),
    [activeResumeId, user]
  );
  const profile = useMemo(
    () => getProfileIntelligence(user, activeResumeId),
    [activeResumeId, user]
  );
  const industryExperience = useMemo(
    () => getIndustryExperienceData(user, activeResumeId),
    [activeResumeId, user],
  );
  const resumeIntelligence = useMemo(
    () => getResumeIntelligence(user, activeResumeId),
    [activeResumeId, user],
  );
  const experienceRoles = useMemo(() => {
    const rolesAcrossVersions =
      resumeIntelligence.activeResume?.versions.flatMap((version) => {
        const document = version.parsedDocument;
        const structured =
          document?.structuredResume ??
          (document?.lines.length ? buildStructuredResume(document.lines) : undefined);
        return structured?.experience ?? [];
      }) ?? [];
    const activeRoles = resumeIntelligence.structuredResume?.experience ?? [];
    const relevantIndustryHistory =
      !user.industryHistoryResumeId || user.industryHistoryResumeId === activeResumeId
        ? user.industryHistory ?? []
        : [];

    if (resumeIntelligence.activeVersion?.source === "manual_edit") {
      return mergeResumeExperience(activeRoles, relevantIndustryHistory);
    }

    return mergeResumeExperience(
      [...rolesAcrossVersions, ...activeRoles],
      relevantIndustryHistory,
    );
  }, [activeResumeId, resumeIntelligence.activeResume, resumeIntelligence.activeVersion?.source, resumeIntelligence.structuredResume, user.industryHistory, user.industryHistoryResumeId]);
  const companyCount = new Set(
    experienceRoles.map((role) => role.company.trim()).filter(Boolean),
  ).size;
  const impactCount = experienceRoles.reduce(
    (count, role) =>
      count +
      role.bullets.filter((bullet) =>
        /(?:[$%]|\b\d+(?:[.,]\d+)?(?:\+|[KMB])?\b)/i.test(bullet),
      ).length,
    0,
  );
  const effectiveHighlights = profile.effective.highlights;
  const acceptedEvidence = user.planningProgress.submittedEvidence.length;
  const hasResume = profile.hasResume;
  const selectedGoalDirections = user.onboarding?.goalDirections ?? [];
  const primaryGoalDirection = selectedGoalDirections.includes("start_business")
    ? "start_business"
    : user.onboarding?.primaryGoalDirection;
  const primaryGoal = primaryGoalDirection
    ? goalDirectionLabels[primaryGoalDirection]
    : user.onboarding?.primaryIntent
      ? legacyIntentLabels[user.onboarding.primaryIntent]
      : user.goals[0]?.title || "Add your next goal";
  const directionSelections = selectedGoalDirections.length > 0
    ? selectedGoalDirections
    : primaryGoalDirection
      ? [primaryGoalDirection]
      : [];
  const onnFeedSignals = useMemo(() => deriveOnnFeedSignals(user), [user]);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-white">
        <header
          data-testid="home-profile-header"
          className="relative z-10 grid shrink-0 gap-y-4 rounded-2xl bg-white px-6 pb-0 pt-0 text-[#102f39]"
        >
          <div className="min-w-0 text-left">
            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <h2 data-testid="profile-name" className="text-3xl font-semibold tracking-tight sm:text-4xl">{user.name}</h2>
                <div className="mt-2 grid grid-cols-[max-content_minmax(0,1fr)] items-baseline gap-x-1 gap-y-1 text-sm text-slate-500">
                  <span className="font-semibold text-[#294653]">Current:</span>
                  <p data-testid="profile-current">
                  {profile.resumeValues.currentTitle || "Upload a resume to add your current title"}
                  </p>
                  <span className="font-semibold text-[#294653]">Goal:</span>
                  <p data-testid="profile-goal">{primaryGoal}</p>
                </div>
              </div>
              <HomeHeaderMenu
                onGuide={() => setActiveView("guide")}
                onLayout={() => setActiveView("layout")}
                onOnboarding={reopenOnboarding}
                onProfile={() => setActiveView("profile")}
              />
            </div>

            <div className="mt-2">
              <HighlightsTile
                highlights={effectiveHighlights}
                onSave={(highlights) => updateProfile({ highlights })}
                placement="profileHeader"
              />
            </div>
          </div>
        </header>

        <div
          data-testid="home-dashboard-body"
          className="relative min-h-0 flex-1 overflow-y-auto"
        >
        {activeView === "post" ? (
          <UserPostingEditor onClose={() => setActiveView("overview")} />
        ) : activeView === "layout" ? <HomeLayoutDesigner /> : homeLayoutId === "career-editorial" ? (
          <HomeMagazine
            feedClassifications={onnFeedSignals.classifications}
            feedTopics={onnFeedSignals.topics}
            currentTitle={profile.resumeValues.currentTitle}
            highlights={effectiveHighlights}
            proofCount={acceptedEvidence}
            readiness={hasResume && plan ? plan.readiness : undefined}
            savedCount={user.opportunityProgress.savedOpportunityIds.length}
          />
        ) : <>
        <section className="home-layout-grid grid auto-rows-[minmax(9rem,auto)] grid-cols-1 gap-4 sm:grid-cols-2" data-home-layout={homeLayoutId}>
          <div className="min-w-0 sm:col-span-2" data-home-slot="experience">
            <ExperienceTileGroup
              companyCount={companyCount}
              hasResume={hasResume}
              roles={experienceRoles}
              roleCount={experienceRoles.length}
              onSaveRoles={(roles) => updateResumeExperience(activeResumeId, roles)}
              onSaveStrengths={(strengths) => updateProfile({ skills: strengths })}
              strengths={profile.effective.skills}
            />
          </div>
          <div className="min-w-0" data-home-slot="industries">
            <IndustriesVennTile
              data={industryExperience}
              onSaveJobs={(industryHistory) =>
                updateProfile({ industryHistory, industryHistoryResumeId: activeResumeId })
              }
            />
          </div>
          <div className="min-w-0" data-home-slot="direction">
            <ActiveDirectionTile
              labels={goalDirectionLabels}
              selectedDirections={directionSelections}
              onSave={(directions) => {
                if (!user.onboarding) return;
                updateProfile({
                  onboarding: {
                    ...user.onboarding,
                    goalDirections: directions,
                    primaryGoalDirection: directions[0],
                  },
                });
              }}
            />
          </div>
          <div className="min-w-0" data-home-slot="readiness">
            <HighlightTile tone="teal" label="Readiness" value={hasResume && plan ? `${plan.readiness}%` : "—"} detail={hasResume ? "evidence-backed" : "Upload a resume to assess"} />
          </div>
          <div className="min-w-0 sm:col-span-2" data-home-slot="proof">
            <HighlightTile tone="pale" label="Proof points" value={acceptedEvidence} detail="verified evidence connected to your plan" />
          </div>
          <div className="min-w-0" data-home-slot="impact">
            <HighlightTile
              tone="slate"
              label="Impact"
              value={hasResume && impactCount > 0 ? impactCount : "—"}
              detail={
                hasResume
                  ? impactCount > 0
                    ? "quantified achievements"
                    : "Add measurable outcomes"
                  : "Upload a resume to assess"
              }
            />
          </div>
          <div className="min-w-0" data-home-slot="saved">
            <HighlightTile tone="aqua" label="Saved paths" value={user.opportunityProgress.savedOpportunityIds.length} detail="opportunities worth pursuing" />
          </div>
        </section>

        {effectiveHighlights.length > 0 ? (
          <section className="mt-5 grid gap-3 sm:grid-cols-3">
            {effectiveHighlights.slice(0, 3).map((highlight, index) => (
              <div key={`${highlight}-${index}`} className="border-l-2 border-orange-400 bg-[#f3f8f8] px-5 py-4 text-sm font-semibold text-[#173a46]">
                {highlight}
              </div>
            ))}
          </section>
        ) : null}
        </>}
      </div>
    </div>
  );
}
