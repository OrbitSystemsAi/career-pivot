"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/core/auth/AuthProvider";
import { getResumeProfilePrefill } from "@/core/resumeParsing/getResumeProfilePrefill";
import { useUser } from "@/core/user/UserProvider";
import type {
  OnboardingDraft,
  OnboardingGoalDirection,
  OnboardingVisionMilestone,
  UserProfile,
} from "@/core/user/userTypes";
import {
  resumeFileAccept,
  useResumeUpload,
} from "@/modules/resume/hooks/useResumeUpload";

type OnboardingIntent = NonNullable<
  NonNullable<UserProfile["onboarding"]>["primaryIntent"]
>;

const goalDirectionOptions: Array<{
  id: OnboardingGoalDirection;
  label: string;
  detail: string;
  category: "Career" | "Flexibility & place" | "Business" | "Life & family";
  intent: OnboardingIntent;
}> = [
  {
    id: "pursue_new_title",
    label: "Pursue a new title",
    detail: "Move into a role with greater scope, influence, or compensation.",
    category: "Career",
    intent: "find_job",
  },
  {
    id: "find_better_job",
    label: "Find a better job",
    detail: "Use my experience in a healthier or more rewarding environment.",
    category: "Career",
    intent: "find_job",
  },
  {
    id: "change_careers",
    label: "Change careers",
    detail: "Transfer what I know into a different field or profession.",
    category: "Career",
    intent: "change_career",
  },
  {
    id: "return_to_work",
    label: "Return to work",
    detail: "Reenter the workforce after time away or a major life change.",
    category: "Career",
    intent: "find_job",
  },
  {
    id: "work_from_home",
    label: "Work from home",
    detail: "Build a career that can be performed primarily from home.",
    category: "Flexibility & place",
    intent: "reshape_life_work",
  },
  {
    id: "work_remote",
    label: "Work remotely",
    detail: "Create location flexibility without limiting the work I can pursue.",
    category: "Flexibility & place",
    intent: "reshape_life_work",
  },
  {
    id: "work_abroad",
    label: "Work from another country",
    detail: "Find a role or business model that supports living internationally.",
    category: "Flexibility & place",
    intent: "reshape_life_work",
  },
  {
    id: "relocate",
    label: "Relocate",
    detail: "Move somewhere new and build work around that decision.",
    category: "Flexibility & place",
    intent: "reshape_life_work",
  },
  {
    id: "start_business",
    label: "Start a new business",
    detail: "Turn an idea, skill, or market need into a viable business.",
    category: "Business",
    intent: "build_business",
  },
  {
    id: "grow_business",
    label: "Grow my current business",
    detail: "Strengthen demand, revenue, systems, or the team around it.",
    category: "Business",
    intent: "build_business",
  },
  {
    id: "build_multiple_businesses",
    label: "Build multiple businesses",
    detail: "Create a portfolio of income streams, ventures, or investments.",
    category: "Business",
    intent: "build_business",
  },
  {
    id: "independent_work",
    label: "Work independently",
    detail: "Build a consulting, freelance, creative, or portfolio career.",
    category: "Business",
    intent: "build_business",
  },
  {
    id: "start_family",
    label: "Start or grow a family",
    detail: "Plan work around the time, stability, and presence family requires.",
    category: "Life & family",
    intent: "reshape_life_work",
  },
  {
    id: "become_stay_at_home_parent",
    label: "Become a stay-at-home parent",
    detail: "Make caregiving the priority while planning finances and future options.",
    category: "Life & family",
    intent: "reshape_life_work",
  },
  {
    id: "work_around_caregiving",
    label: "Work around caregiving",
    detail: "Create a sustainable career while supporting someone who depends on me.",
    category: "Life & family",
    intent: "reshape_life_work",
  },
  {
    id: "create_more_life_space",
    label: "Create more space for life",
    detail: "Reduce pressure or hours and make room for health, family, or meaning.",
    category: "Life & family",
    intent: "reshape_life_work",
  },
  {
    id: "explore_possibilities",
    label: "Explore before deciding",
    detail: "Compare realistic possibilities before I commit to one direction.",
    category: "Life & family",
    intent: "explore",
  },
];

const originalVisionMotivationOptions = [
  "Purpose and impact",
  "Creative expression",
  "Financial security",
  "Independence",
  "Recognition",
  "Belonging",
  "Adventure",
  "Flexibility",
  "Leadership",
  "Helping others",
];

const currentSituationOptions = [
  "Employed full-time",
  "Employed part-time",
  "Unemployed",
  "Recently laid off",
  "Recently welcomed a child",
  "Entering college",
  "Recently finished college",
  "Currently studying",
  "Returning to school",
  "Starting a business",
  "Running a business",
  "Juggling jobs or careers",
  "Bankruptcy or financial reset",
  "Primary caregiver",
  "Health recovery or adjustment",
  "Retired or reentering work",
];

const currentCommitmentOptions = [
  "One primary job",
  "Multiple jobs",
  "Multiple career paths",
  "Building a business",
  "School or certification",
  "Job search",
  "Caregiving",
  "Health or recovery",
];

const emotionalSignalOptions = [
  "Hopeful",
  "Energized",
  "Curious",
  "Steady",
  "Uncertain",
  "Overwhelmed",
  "Burned out",
  "Frustrated",
  "Grieving a change",
  "Under pressure",
];

const coachingPhrases = [
  "Let’s take a moment to understand where you are and what you want next, so your workspace can start working for you.",
  "You don’t need every answer today. We’ll start with what matters most and build clarity from there.",
  "Your experience has already brought you this far. Let’s make it easier to see where it can take you next.",
  "A meaningful career change begins with an honest look at what you want more of—and what you’re ready to leave behind.",
  "There is more than one good path forward. We’ll help you compare the possibilities and choose with confidence.",
  "Big goals become manageable when we turn them into clear decisions, realistic milestones, and steady progress.",
  "Your next chapter can look different from anyone else’s. The goal is to build one that genuinely works for you.",
  "You bring more value than a job title can capture. Let’s make your strengths, experience, and potential easier to see.",
  "It’s okay if your direction is still taking shape. Curiosity is often where the strongest plans begin.",
  "Where you are today is simply our starting point. Together, we’ll create a practical path toward what comes next.",
];

const originalVisionCoachingMessages = [
  {
    headline: "Start with what you had in mind.",
    body: "Before we plan forward, let’s understand the future you once pictured and what mattered about it.",
  },
  {
    headline: "Remember what once pulled you forward.",
    body: "Your earliest hopes can reveal the interests, values, and possibilities that first gave your direction meaning.",
  },
  {
    headline: "Look beneath the original plan.",
    body: "The title may have changed, but the purpose behind it—freedom, impact, mastery, security, or creativity—may still matter.",
  },
  {
    headline: "Separate the dream from the deadline.",
    body: "You are not here to judge what did or did not happen. You are here to understand what the vision was trying to give you.",
  },
  {
    headline: "Notice what the vision represented.",
    body: "Sometimes the career was only part of the dream. The life around it may be the clearest clue to what you still want.",
  },
  {
    headline: "Let your earlier ambition speak.",
    body: "What you wanted then can show us strengths and motivations that became quieter while you handled the demands of today.",
  },
  {
    headline: "Name the life you expected to build.",
    body: "Think beyond a job title. Consider the work, relationships, place, pace, and sense of contribution you imagined.",
  },
  {
    headline: "Keep what still feels alive.",
    body: "Some parts of the old plan may no longer fit. Others may still carry energy worth bringing into your next chapter.",
  },
  {
    headline: "Honor who you hoped to become.",
    body: "Your original vision may hold qualities you wanted to express—leadership, independence, service, courage, or creative freedom.",
  },
  {
    headline: "Treat the first vision as evidence, not a contract.",
    body: "You do not have to return to the old plan. We are using it to understand you more clearly before choosing what comes next.",
  },
];

const currentStateCoachingMessages = [
  {
    headline: "Start with what is true today.",
    body: "You do not need to minimize where you are or explain it away. An honest starting point gives us something real to build from.",
  },
  {
    headline: "Your story is more than a résumé.",
    body: "Your responsibilities, relationships, setbacks, and growth all shape what a fulfilling next chapter can look like.",
  },
  {
    headline: "Name the season you are in.",
    body: "What worked in an earlier chapter may not fit this one. Recognizing that change is insight—not failure.",
  },
  {
    headline: "Honor what has changed.",
    body: "Your priorities may have shifted with time, experience, family, health, or circumstance. Your plan should be allowed to evolve too.",
  },
  {
    headline: "Notice what still energizes you.",
    body: "The work that holds your attention, feels meaningful, or leaves you curious can reveal strengths worth carrying forward.",
  },
  {
    headline: "Your constraints belong in the plan.",
    body: "Time, location, finances, and responsibilities are not inconveniences to ignore. They help us design a direction that can actually work.",
  },
  {
    headline: "Experience can become leverage.",
    body: "Even when you want something different, the judgment, resilience, and perspective you have earned can support the pivot ahead.",
  },
  {
    headline: "Clarity grows from honest reflection.",
    body: "You do not have to judge your current position. We are simply noticing what is working, what is not, and what deserves attention next.",
  },
  {
    headline: "You are allowed to redefine success.",
    body: "A stronger title is only one possibility. Success might also mean flexibility, purpose, stability, creativity, or more time for your life.",
  },
  {
    headline: "This is a starting point, not a verdict.",
    body: "Where you are today does not limit where you can go. It helps us choose a path that is both ambitious and grounded in your reality.",
  },
];

export default function OnboardingScreen() {
  const { completeOnboarding, logout, session } = useAuth();
  const { updateProfile, user } = useUser();
  const isReturningUser = Boolean(user.onboarding?.completedAt);
  const savedDraft = user.onboardingDraft;
  const [step, setStep] = useState<OnboardingDraft["step"]>(
    session?.onboardingReturnVisit ? 0 : savedDraft?.step ?? 0,
  );
  const [name, setName] = useState(savedDraft?.name ?? session?.displayName ?? "");
  const [age] = useState(savedDraft?.age ?? user.age?.toString() ?? "");
  const [location, setLocation] = useState(savedDraft?.location ?? user.location ?? "");
  const [currentTitle, setCurrentTitle] = useState(
    savedDraft?.currentTitle ?? user.currentTitle ?? ""
  );
  const [currentIndustry, setCurrentIndustry] = useState(
    savedDraft?.currentIndustry ?? user.currentIndustry ?? ""
  );
  const [originalVisionMilestones, setOriginalVisionMilestones] =
    useState<OnboardingVisionMilestone[]>(
      savedDraft?.originalVisionMilestones?.map((milestone) => ({ ...milestone })) ?? [
        { id: "vision-milestone-1", vision: "", timing: "" },
      ]
    );
  const [originalVisionMotivations, setOriginalVisionMotivations] = useState<string[]>(
    savedDraft?.originalVisionMotivations ?? []
  );
  const [originalVisionEnduringElements, setOriginalVisionEnduringElements] = useState(
    savedDraft?.originalVisionEnduringElements ?? ""
  );
  const [originalVisionTurningPoints, setOriginalVisionTurningPoints] = useState(
    savedDraft?.originalVisionTurningPoints ?? ""
  );
  const [originalVisionAlternativePath, setOriginalVisionAlternativePath] = useState(
    savedDraft?.originalVisionAlternativePath ?? ""
  );
  const [originalVisionCurrentFeeling, setOriginalVisionCurrentFeeling] = useState(
    savedDraft?.originalVisionCurrentFeeling ?? ""
  );
  const [currentSituations, setCurrentSituations] = useState<string[]>(
    savedDraft?.currentSituations ?? []
  );
  const [previousRoleExperience, setPreviousRoleExperience] = useState(
    savedDraft?.previousRoleExperience ?? ""
  );
  const [returnToPreviousWork, setReturnToPreviousWork] = useState(
    savedDraft?.returnToPreviousWork ?? ""
  );
  const [currentCommitments, setCurrentCommitments] = useState<string[]>(
    savedDraft?.currentCommitments ?? []
  );
  const [currentEmotionalSignals, setCurrentEmotionalSignals] = useState<string[]>(
    savedDraft?.currentEmotionalSignals ?? []
  );
  const [financialUrgency, setFinancialUrgency] = useState(
    savedDraft?.financialUrgency ?? ""
  );
  const [changeCapacity, setChangeCapacity] = useState(
    savedDraft?.changeCapacity ?? ""
  );
  const [pivotReadiness, setPivotReadiness] = useState(
    savedDraft?.pivotReadiness ?? ""
  );
  const [currentConstraints, setCurrentConstraints] = useState(
    savedDraft?.currentConstraints ?? ""
  );
  const [currentSupport, setCurrentSupport] = useState(
    savedDraft?.currentSupport ?? ""
  );
  const [primaryIntent, setPrimaryIntent] =
    useState<OnboardingIntent | null>(savedDraft?.primaryIntent ?? null);
  const [goalDirections, setGoalDirections] = useState<OnboardingGoalDirection[]>(
    savedDraft?.goalDirections ?? []
  );
  const [primaryGoalDirection, setPrimaryGoalDirection] =
    useState<OnboardingGoalDirection | null>(
      savedDraft?.primaryGoalDirection ?? null
    );
  const [targetStatement, setTargetStatement] = useState(
    savedDraft?.targetStatement ?? ""
  );
  const [workPreference, setWorkPreference] =
    useState<"remote" | "hybrid" | "onsite" | "flexible">(
      savedDraft?.workPreference ?? "flexible"
    );
  const [error, setError] = useState("");
  const [coachingPhraseIndex, setCoachingPhraseIndex] = useState(0);
  const latestUploadedResume = [...user.resumes]
    .reverse()
    .find((resume) => resume.source === "upload");
  const {
    fileInputRef,
    handleResumeFileChange,
    isParsing,
    openResumePicker,
    parseError,
  } = useResumeUpload({
    onParsed: (parsedDocument) => {
      const prefill = getResumeProfilePrefill(parsedDocument);

      if (prefill.name && (!name.trim() || name === "OSai User")) {
        setName(prefill.name);
      }
      if (prefill.location) setLocation(prefill.location);
      if (prefill.currentTitle) setCurrentTitle(prefill.currentTitle);
      if (prefill.currentIndustry) setCurrentIndustry(prefill.currentIndustry);
      setError("");
    },
  });

  const onboardingDraft = useMemo<OnboardingDraft>(
    () => ({
      step,
      name,
      age,
      location,
      currentTitle,
      currentIndustry,
      originalVisionMilestones,
      originalVisionMotivations,
      originalVisionEnduringElements,
      originalVisionTurningPoints,
      originalVisionAlternativePath,
      originalVisionCurrentFeeling,
      currentSituations,
      previousRoleExperience,
      returnToPreviousWork,
      currentCommitments,
      currentEmotionalSignals,
      financialUrgency,
      changeCapacity,
      pivotReadiness,
      currentConstraints,
      currentSupport,
      primaryIntent,
      goalDirections,
      primaryGoalDirection,
      targetStatement,
      workPreference,
      updatedAt: new Date().toISOString(),
    }),
    [
      age,
      changeCapacity,
      currentCommitments,
      currentConstraints,
      currentEmotionalSignals,
      currentIndustry,
      currentSituations,
      currentSupport,
      currentTitle,
      financialUrgency,
      location,
      name,
      originalVisionAlternativePath,
      originalVisionCurrentFeeling,
      originalVisionEnduringElements,
      originalVisionMilestones,
      originalVisionMotivations,
      originalVisionTurningPoints,
      pivotReadiness,
      previousRoleExperience,
      primaryIntent,
      goalDirections,
      primaryGoalDirection,
      returnToPreviousWork,
      step,
      targetStatement,
      workPreference,
    ]
  );

  useEffect(() => {
    updateProfile({ onboardingDraft });
  }, [onboardingDraft, updateProfile]);

  useEffect(() => {
    const persistBeforeLeaving = () => {
      updateProfile({ onboardingDraft });
    };

    window.addEventListener("pagehide", persistBeforeLeaving);
    return () => window.removeEventListener("pagehide", persistBeforeLeaving);
  }, [onboardingDraft, updateProfile]);

  function handleLogout() {
    updateProfile({ onboardingDraft });
    logout();
  }

  function goToPreviousStep(targetStep: number) {
    if (targetStep >= step || targetStep < 0) {
      return;
    }

    setError("");
    setCoachingPhraseIndex(0);
    setStep(targetStep as OnboardingDraft["step"]);
  }

  useEffect(() => {
    if (step !== 0 && step !== 1 && step !== 2) {
      return;
    }

    const messageCount =
      step === 0
        ? coachingPhrases.length
        : step === 1
          ? originalVisionCoachingMessages.length
          : currentStateCoachingMessages.length;

    const phraseCycle = window.setInterval(() => {
      setCoachingPhraseIndex(
        (currentIndex) => (currentIndex + 1) % messageCount
      );
    }, 20_000);

    return () => window.clearInterval(phraseCycle);
  }, [step]);

  function continueFromOriginalVision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const incompleteMilestone = originalVisionMilestones.find(
      (milestone) => milestone.vision.trim().length < 10 || !milestone.timing
    );

    if (incompleteMilestone) {
      setError("Complete each milestone with what you imagined and when it took shape.");
      return;
    }

    if (originalVisionMotivations.length === 0) {
      setError("Choose at least one thing this future represented to you.");
      return;
    }

    if (originalVisionEnduringElements.trim().length < 3) {
      setError("Share what still matters about this vision today.");
      return;
    }

    if (originalVisionTurningPoints.trim().length < 3) {
      setError("Share what changed or redirected the path.");
      return;
    }

    if (!originalVisionCurrentFeeling) {
      setError("Choose how this vision feels to you now.");
      return;
    }

    setError("");
    setCoachingPhraseIndex(0);
    setStep(2);
  }

  function continueFromProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (currentSituations.length === 0) {
      setError("Choose at least one situation that describes your life today.");
      return;
    }

    const isEmployed = currentSituations.some((situation) =>
      situation.startsWith("Employed")
    );
    const isBetweenRoles = currentSituations.some((situation) =>
      ["Unemployed", "Recently laid off"].includes(situation)
    );

    if (isEmployed && currentTitle.trim().length < 2) {
      setError("Add your current title so we can understand the work you are doing now.");
      return;
    }

    if (isBetweenRoles && !previousRoleExperience) {
      setError("Tell us how your most recent work felt to you.");
      return;
    }

    if (isBetweenRoles && !returnToPreviousWork) {
      setError("Tell us whether you would want to do similar work again.");
      return;
    }

    if (currentCommitments.length === 0) {
      setError("Choose at least one commitment currently asking for your time.");
      return;
    }

    if (currentEmotionalSignals.length === 0) {
      setError("Choose at least one word that reflects how this chapter feels.");
      return;
    }

    if (!financialUrgency || !changeCapacity || !pivotReadiness) {
      setError("Complete the urgency, capacity, and pivot-readiness questions.");
      return;
    }

    if (currentConstraints.trim().length < 3) {
      setError("Share what your next plan needs to respect.");
      return;
    }

    setError("");
    setCoachingPhraseIndex(0);
    setStep(3);
  }

  function finishOnboarding() {
    if (goalDirections.length === 0) {
      setError("Choose at least one goal for your next chapter.");
      return;
    }

    if (!primaryGoalDirection || !primaryIntent) {
      setError("Choose the goal that matters most right now.");
      return;
    }

    const completedAt = new Date().toISOString();

    updateProfile({
      name: name.trim() || user.name,
      age:
        Number.isInteger(Number(age)) && Number(age) >= 13 && Number(age) <= 100
          ? Number(age)
          : user.age,
      location: location.trim() || user.location,
      currentTitle: currentTitle.trim(),
      currentIndustry: currentIndustry.trim(),
      onboardingDraft: undefined,
      onboarding: {
        primaryIntent,
        goalDirections,
        primaryGoalDirection,
        originalVision: originalVisionMilestones[0].vision.trim(),
        originalVisionTiming: originalVisionMilestones[0].timing,
        originalVisionMilestones: originalVisionMilestones.map((milestone) => ({
          ...milestone,
          vision: milestone.vision.trim(),
        })),
        originalVisionMotivations,
        originalVisionEnduringElements: originalVisionEnduringElements.trim(),
        originalVisionTurningPoints: originalVisionTurningPoints.trim(),
        originalVisionAlternativePath: originalVisionAlternativePath.trim() || undefined,
        originalVisionCurrentFeeling,
        currentSituations,
        previousRoleExperience: previousRoleExperience || undefined,
        returnToPreviousWork: returnToPreviousWork || undefined,
        currentCommitments,
        currentEmotionalSignals,
        financialUrgency,
        changeCapacity,
        pivotReadiness,
        currentConstraints: currentConstraints.trim(),
        currentSupport: currentSupport.trim() || undefined,
        targetStatement: targetStatement.trim() || undefined,
        workPreference,
        completedAt,
      },
    });
    completeOnboarding();
  }

  return (
    <div
      aria-label="Career Pivot onboarding"
      aria-modal="true"
      className="fixed inset-0 z-50 h-screen overflow-hidden bg-[#092b39]/70 px-5 py-6 text-[#123541] backdrop-blur-sm sm:px-8 sm:py-8"
      role="dialog"
    >
      <button
        className="fixed right-6 top-5 z-30 text-sm font-semibold text-[#8fc7d2] transition hover:text-[#ff7a00] focus:outline-none focus-visible:text-[#ff7a00] sm:right-8 sm:top-7"
        onClick={handleLogout}
        type="button"
      >
        Log out
      </button>

      <div className="relative mx-auto flex h-[calc(100vh-3rem)] max-w-6xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl sm:h-[calc(100vh-4rem)]">
        <div className="grid min-h-0 flex-1 grid-rows-[minmax(12rem,0.55fr)_minmax(0,1.45fr)] lg:grid-cols-[0.72fr_1.28fr] lg:grid-rows-1">
          <aside
            className="relative min-h-0 overflow-hidden bg-[#123f4d] px-7 py-8 text-white sm:px-10 lg:py-12"
            data-testid="onboarding-coach-pane"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: "url('/nav-texture.png')",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
            <div className="relative">
              {step > 0 ? (
                <button
                  aria-label={
                    step === 1 ? "Go back to welcome" : `Go back to step ${step - 1}`
                  }
                  className="group text-xs font-semibold uppercase tracking-[0.2em] text-[#9edce8] transition hover:text-[#ff7a00] focus:outline-none focus-visible:text-[#ff7a00]"
                  onClick={() => goToPreviousStep(step - 1)}
                  type="button"
                >
                  <span className="group-hover:hidden group-focus-visible:hidden">
                    Step {step} of 3
                  </span>
                  <span className="hidden group-hover:inline group-focus-visible:inline">
                    Go Back
                  </span>
                </button>
              ) : null}
              <h1
                className={`mt-5 max-w-md text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl ${
                  step === 1 || step === 2 ? "onboarding-coach-phrase" : ""
                }`}
                key={
                  step === 1 || step === 2
                    ? `step-${step}-headline-${coachingPhraseIndex}`
                    : `step-headline-${step}`
                }
              >
                {step === 0
                  ? `${user.onboarding?.completedAt ? "Welcome Back" : "Welcome"}, ${name.split(" ")[0] || "there"}.`
                  : step === 1
                    ? originalVisionCoachingMessages[coachingPhraseIndex].headline
                    : step === 2
                      ? currentStateCoachingMessages[coachingPhraseIndex].headline
                      : "Choose what comes next."}
              </h1>
              <p
                aria-live="off"
                className={`mt-5 max-w-md text-base leading-7 text-[#c4dce1] ${
                  step === 0 || step === 1 || step === 2 ? "onboarding-coach-phrase" : ""
                }`}
                key={
                  step === 0 || step === 1 || step === 2
                    ? `step-${step}-message-${coachingPhraseIndex}`
                    : step
                }
              >
                {step === 0
                  ? coachingPhrases[coachingPhraseIndex]
                  : step === 1
                    ? originalVisionCoachingMessages[coachingPhraseIndex].body
                    : step === 2
                      ? currentStateCoachingMessages[coachingPhraseIndex].body
                      : "Choose the direction that best reflects what you need now. You can refine it as your plan takes shape."}
              </p>
            </div>

            {step > 0 ? (
              <div className="relative mt-10 flex gap-2 lg:absolute lg:bottom-10 lg:left-10">
                {[1, 2, 3].map((item) => {
                  const canGoBack = item < step;

                  return (
                    <button
                      aria-current={item === step ? "step" : undefined}
                      aria-label={
                        canGoBack
                          ? `Go back to step ${item}`
                          : item === step
                            ? `Current step: ${item} of 3`
                            : `Step ${item} is not available yet`
                      }
                      className={`h-1.5 rounded-full transition-all ${
                        item === step
                          ? "w-10 bg-[#ff7a00]"
                          : "w-5 bg-white/25"
                      } ${
                        canGoBack
                          ? "cursor-pointer hover:bg-[#ff7a00] focus:outline-none focus-visible:bg-[#ff7a00] focus-visible:ring-2 focus-visible:ring-white"
                          : "cursor-default"
                      }`}
                      disabled={!canGoBack}
                      key={item}
                      onClick={() => goToPreviousStep(item)}
                      type="button"
                    />
                  );
                })}
              </div>
            ) : null}
          </aside>

          <section
            className="relative min-h-0 overflow-hidden px-7 py-10 sm:px-12 lg:px-16"
            data-testid="onboarding-step-pane"
          >
            {step > 0 ? (
              <button
                aria-label={
                  step === 1 ? "Go back to welcome" : `Go back to step ${step - 1}`
                }
                className="absolute right-7 top-6 text-sm font-semibold text-[#64748b] opacity-60 transition hover:text-[#ff7a00] hover:opacity-100 focus:outline-none focus-visible:text-[#ff7a00] focus-visible:opacity-100 sm:right-12 sm:top-8 lg:right-8 lg:top-7"
                onClick={() => goToPreviousStep(step - 1)}
                type="button"
              >
                Go Back
              </button>
            ) : null}
            <div className="h-full w-full">
              {step === 0 ? (
                <div className="flex h-full max-w-2xl flex-col">
                  <header className="shrink-0 border-b border-[#e2ecef] pb-5 pr-24" data-testid="onboarding-step-header">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1689a3]">
                      {isReturningUser ? "Review and refine" : "A clear beginning"}
                    </p>
                    <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em]">
                      First, let’s understand you—not just your résumé.
                    </h2>
                  </header>
                  <div className="min-h-0 flex-1 overflow-y-auto pr-2 pt-8" data-testid="onboarding-step-scroll">
                    <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      ["01", "What you had in mind", "The future you originally imagined"],
                      ["02", "Where you are now", "Your current chapter and experience"],
                      ["03", "Where you want to go", "Your goals, pivot, or new direction"],
                    ].map(([number, title, detail]) => (
                      <div
                        className="rounded-2xl border border-[#c9dde2] bg-[#f4fafb] p-5"
                        key={number}
                      >
                        <p className="text-sm font-semibold text-[#ff7a00]">{number}</p>
                        <p className="mt-5 font-semibold">{title}</p>
                        <p className="mt-1 text-sm text-[#64748b]">{detail}</p>
                      </div>
                    ))}
                    </div>
                    <button
                      className="mt-9 rounded-xl bg-[#123f4d] px-7 py-3.5 font-semibold text-white transition hover:bg-[#ff7a00] focus:outline-none focus:ring-4 focus:ring-[#ffd7b2]"
                      onClick={() => {
                        setCoachingPhraseIndex(0);
                        setStep(1);
                      }}
                      type="button"
                    >
                      {isReturningUser ? "Continue" : "Get started"}
                    </button>
                  </div>
                </div>
              ) : null}

              {step === 1 ? (
                <form className="flex h-full max-w-3xl flex-col" onSubmit={continueFromOriginalVision}>
                  <header className="shrink-0 border-b border-[#e2ecef] pb-5 pr-24" data-testid="onboarding-step-header">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1689a3]">
                      What you had in mind
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">
                      What futures did you imagine along the way?
                    </h2>
                    <p className="mt-3 max-w-xl text-[#64748b]">
                      Add the meaningful moments when a new picture of your future took shape. They do not need to match where you are today.
                    </p>
                  </header>
                  <div className="min-h-0 flex-1 overflow-y-auto pl-6 pr-2 pt-7" data-testid="onboarding-step-scroll">
                  <div className="relative space-y-5 border-l-2 border-[#c9dde2] pl-7">
                    {originalVisionMilestones.map((milestone, index) => (
                      <div
                        className="relative rounded-2xl border border-[#c9dde2] bg-[#f7fbfc] p-5"
                        key={milestone.id}
                      >
                        <span className="absolute -left-[2.7rem] top-5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#ff7a00] text-xs font-bold text-white shadow-sm">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1689a3]">
                            Milestone {index + 1}
                          </p>
                          {originalVisionMilestones.length > 1 ? (
                            <button
                              aria-label={`Remove milestone ${index + 1}`}
                              className="text-sm font-semibold text-[#80909e] transition hover:text-[#ff7a00]"
                              onClick={() => {
                                setOriginalVisionMilestones((current) =>
                                  current.filter((item) => item.id !== milestone.id)
                                );
                                setError("");
                              }}
                              type="button"
                            >
                              Remove
                            </button>
                          ) : null}
                        </div>
                        <div className="mt-4 grid gap-5 sm:grid-cols-[1.4fr_0.6fr]">
                          <label>
                            <span className="mb-2 block text-sm font-semibold">
                              The future you had in mind
                            </span>
                            <textarea
                              aria-label={`Milestone ${index + 1}: The future you had in mind`}
                              autoFocus={index === 0}
                              className="min-h-28 w-full resize-y rounded-xl border border-[#bfd3d8] bg-white px-4 py-3 outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                              onChange={(event) => {
                                const vision = event.target.value;
                                setOriginalVisionMilestones((current) =>
                                  current.map((item) =>
                                    item.id === milestone.id ? { ...item, vision } : item
                                  )
                                );
                              }}
                              placeholder="I thought I would..."
                              required
                              value={milestone.vision}
                            />
                          </label>
                          <label>
                            <span className="mb-2 block text-sm font-semibold">
                              When did it take shape?
                            </span>
                            <select
                              aria-label={`Milestone ${index + 1}: When did it take shape?`}
                              className="h-12 w-full rounded-xl border border-[#bfd3d8] bg-white px-4 outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                              onChange={(event) => {
                                const timing = event.target.value;
                                setOriginalVisionMilestones((current) =>
                                  current.map((item) =>
                                    item.id === milestone.id ? { ...item, timing } : item
                                  )
                                );
                              }}
                              required
                              value={milestone.timing}
                            >
                              <option value="">Choose a life stage</option>
                              <option value="childhood">Childhood</option>
                              <option value="teen_years">Teen years</option>
                              <option value="early_adulthood">Early adulthood</option>
                              <option value="mid_career">Mid-career</option>
                              <option value="recently">More recently</option>
                            </select>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    className="ml-7 mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-[#1689a3] px-4 py-2.5 text-sm font-semibold text-[#166579] transition hover:border-[#ff7a00] hover:bg-[#fff6ed] hover:text-[#a84c0b]"
                    onClick={() => {
                      setOriginalVisionMilestones((current) => [
                        ...current,
                        {
                          id: `vision-milestone-${Date.now()}`,
                          vision: "",
                          timing: "",
                        },
                      ]);
                      setError("");
                    }}
                    type="button"
                  >
                    <span aria-hidden="true">＋</span>
                    Add another milestone
                  </button>

                  <fieldset className="mt-6">
                    <legend className="text-sm font-semibold">
                      What did that future represent to you?
                    </legend>
                    <p className="mt-1 text-sm text-[#64748b]">Choose all that apply.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {originalVisionMotivationOptions.map((motivation) => {
                        const isSelected = originalVisionMotivations.includes(motivation);

                        return (
                          <button
                            aria-pressed={isSelected}
                            className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                              isSelected
                                ? "border-[#ff7a00] bg-[#fff3e8] text-[#8c4309]"
                                : "border-[#bfd3d8] bg-white text-[#405d65] hover:border-[#1689a3] hover:bg-[#f4fafb]"
                            }`}
                            key={motivation}
                            onClick={() => {
                              setOriginalVisionMotivations((current) =>
                                current.includes(motivation)
                                  ? current.filter((item) => item !== motivation)
                                  : [...current, motivation]
                              );
                              setError("");
                            }}
                            type="button"
                          >
                            {motivation}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <label>
                      <span className="mb-2 block text-sm font-semibold">
                        What still matters about it today?
                      </span>
                      <textarea
                        className="min-h-24 w-full resize-y rounded-xl border border-[#bfd3d8] px-4 py-3 outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                        onChange={(event) => setOriginalVisionEnduringElements(event.target.value)}
                        placeholder="The part I still want is..."
                        required
                        value={originalVisionEnduringElements}
                      />
                    </label>
                    <label>
                      <span className="mb-2 block text-sm font-semibold">
                        What changed or redirected the path?
                      </span>
                      <textarea
                        className="min-h-24 w-full resize-y rounded-xl border border-[#bfd3d8] px-4 py-3 outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                        onChange={(event) => setOriginalVisionTurningPoints(event.target.value)}
                        placeholder="Responsibilities, opportunities, setbacks, choices..."
                        required
                        value={originalVisionTurningPoints}
                      />
                    </label>
                    <label>
                      <span className="mb-2 block text-sm font-semibold">
                        What did you pursue or need to do instead?
                        <span className="font-normal text-[#80909e]"> (optional)</span>
                      </span>
                      <textarea
                        className="min-h-24 w-full resize-y rounded-xl border border-[#bfd3d8] px-4 py-3 outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                        onChange={(event) => setOriginalVisionAlternativePath(event.target.value)}
                        placeholder="The path I took was..."
                        value={originalVisionAlternativePath}
                      />
                    </label>
                    <label>
                      <span className="mb-2 block text-sm font-semibold">
                        How does that original vision feel now?
                      </span>
                      <select
                        className="h-12 w-full rounded-xl border border-[#bfd3d8] bg-white px-4 outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                        onChange={(event) => setOriginalVisionCurrentFeeling(event.target.value)}
                        required
                        value={originalVisionCurrentFeeling}
                      >
                        <option value="">Choose what feels closest</option>
                        <option value="still_drawn">I still feel strongly drawn to it</option>
                        <option value="some_parts">Some parts still matter</option>
                        <option value="curious">I am curious about it again</option>
                        <option value="mixed">I have mixed feelings</option>
                        <option value="at_peace">I am at peace with letting it go</option>
                        <option value="no_longer_fits">It no longer fits who I am</option>
                      </select>
                    </label>
                  </div>
                  {error ? (
                    <p className="mt-4 text-sm text-[#a84c0b]" role="alert">{error}</p>
                  ) : null}
                  <div className="mt-8 flex items-center gap-4">
                    <button
                      className="rounded-xl border border-[#bfd3d8] px-6 py-3 font-semibold text-[#405d65] transition hover:bg-[#eef6f7]"
                      onClick={() => goToPreviousStep(0)}
                      type="button"
                    >
                      Back
                    </button>
                    <button
                      className="rounded-xl bg-[#123f4d] px-7 py-3 font-semibold text-white transition hover:bg-[#ff7a00]"
                      type="submit"
                    >
                      Continue
                    </button>
                  </div>
                  </div>
                </form>
              ) : null}

              {step === 2 ? (
                <form className="flex h-full max-w-3xl flex-col" onSubmit={continueFromProfile}>
                  <header className="shrink-0 border-b border-[#e2ecef] pb-5 pr-24" data-testid="onboarding-step-header">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1689a3]">
                      Where you are now
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">
                      What is shaping your life today?
                    </h2>
                    <p className="mt-3 max-w-2xl text-[#64748b]">
                      This is context, not a diagnosis. Choose what is true now so your plan can respect your responsibilities, resources, and readiness for change.
                    </p>
                  </header>
                  <div className="min-h-0 flex-1 overflow-y-auto pr-2 pt-7" data-testid="onboarding-step-scroll">
                  <div className="rounded-2xl border border-[#c9dde2] bg-[#f4fafb] p-5">
                    <input
                      accept={resumeFileAccept}
                      className="hidden"
                      onChange={handleResumeFileChange}
                      ref={fileInputRef}
                      type="file"
                    />
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1689a3]">
                          Start with your résumé
                        </p>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-[#526a76]">
                          Upload a PDF or DOCX to prefill your name, location, recent title, industry, experience, and skills when they can be identified.
                        </p>
                        {latestUploadedResume ? (
                          <p className="mt-2 text-sm font-semibold text-[#166579]">
                            Added: {latestUploadedResume.fileName ?? latestUploadedResume.name}
                          </p>
                        ) : (
                          <p className="mt-2 text-xs text-[#80909e]">
                            No résumé? You can continue and add one later.
                          </p>
                        )}
                      </div>
                      <button
                        className="shrink-0 rounded-xl bg-[#123f4d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff7a00] disabled:cursor-wait disabled:opacity-65"
                        disabled={isParsing}
                        onClick={openResumePicker}
                        type="button"
                      >
                        {isParsing
                          ? "Reading résumé..."
                          : latestUploadedResume
                            ? "Upload another"
                            : "Upload résumé"}
                      </button>
                    </div>
                    {parseError ? (
                      <p className="mt-3 rounded-xl bg-[#fff2e8] px-4 py-3 text-sm text-[#a84c0b]" role="alert">
                        {parseError}
                      </p>
                    ) : null}
                  </div>

                  <fieldset className="mt-6">
                    <legend className="text-sm font-semibold">
                      Which situations describe your current chapter?
                    </legend>
                    <p className="mt-1 text-sm text-[#64748b]">Choose all that apply.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {currentSituationOptions.map((situation) => {
                        const isSelected = currentSituations.includes(situation);

                        return (
                          <button
                            aria-pressed={isSelected}
                            className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                              isSelected
                                ? "border-[#ff7a00] bg-[#fff3e8] text-[#8c4309]"
                                : "border-[#bfd3d8] bg-white text-[#405d65] hover:border-[#1689a3] hover:bg-[#f4fafb]"
                            }`}
                            key={situation}
                            onClick={() => {
                              setCurrentSituations((current) =>
                                current.includes(situation)
                                  ? current.filter((item) => item !== situation)
                                  : [...current, situation]
                              );
                              setError("");
                            }}
                            type="button"
                          >
                            {situation}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <label>
                      <span className="mb-2 block text-sm font-semibold">Current or most recent title</span>
                      <input
                        className="h-12 w-full rounded-xl border border-[#bfd3d8] px-4 outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                        onChange={(event) => setCurrentTitle(event.target.value)}
                        placeholder="Role or type of work"
                        value={currentTitle}
                      />
                    </label>
                    <label>
                      <span className="mb-2 block text-sm font-semibold">Current or most recent industry</span>
                      <input
                        className="h-12 w-full rounded-xl border border-[#bfd3d8] px-4 outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                        onChange={(event) => setCurrentIndustry(event.target.value)}
                        placeholder="Industry or field"
                        value={currentIndustry}
                      />
                    </label>
                  </div>

                  {currentSituations.some((situation) =>
                    ["Unemployed", "Recently laid off"].includes(situation)
                  ) ? (
                    <div className="mt-6 grid gap-5 rounded-2xl border border-[#c9dde2] bg-[#f4fafb] p-5 sm:grid-cols-2">
                      <label>
                        <span className="mb-2 block text-sm font-semibold">How did your most recent work feel?</span>
                        <select
                          className="h-12 w-full rounded-xl border border-[#bfd3d8] bg-white px-4 outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                          onChange={(event) => setPreviousRoleExperience(event.target.value)}
                          value={previousRoleExperience}
                        >
                          <option value="">Choose what feels closest</option>
                          <option value="meaningful">Meaningful and fulfilling</option>
                          <option value="mostly_positive">Mostly positive</option>
                          <option value="mixed">A mix of good and difficult</option>
                          <option value="draining">Draining or no longer sustainable</option>
                          <option value="harmful">Harmful to my well-being</option>
                          <option value="not_enough_experience">I did not do it long enough to know</option>
                        </select>
                      </label>
                      <label>
                        <span className="mb-2 block text-sm font-semibold">Would you want similar work again?</span>
                        <select
                          className="h-12 w-full rounded-xl border border-[#bfd3d8] bg-white px-4 outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                          onChange={(event) => setReturnToPreviousWork(event.target.value)}
                          value={returnToPreviousWork}
                        >
                          <option value="">Choose what feels closest</option>
                          <option value="yes">Yes, I would return to it</option>
                          <option value="with_changes">Yes, with meaningful changes</option>
                          <option value="short_term">Only as a short-term bridge</option>
                          <option value="no">No, I want a different direction</option>
                          <option value="unsure">I am not sure yet</option>
                        </select>
                      </label>
                    </div>
                  ) : null}

                  <fieldset className="mt-6">
                    <legend className="text-sm font-semibold">What is asking for your time and energy?</legend>
                    <p className="mt-1 text-sm text-[#64748b]">Choose all that apply.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {currentCommitmentOptions.map((commitment) => {
                        const isSelected = currentCommitments.includes(commitment);

                        return (
                          <button
                            aria-pressed={isSelected}
                            className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                              isSelected
                                ? "border-[#ff7a00] bg-[#fff3e8] text-[#8c4309]"
                                : "border-[#bfd3d8] bg-white text-[#405d65] hover:border-[#1689a3] hover:bg-[#f4fafb]"
                            }`}
                            key={commitment}
                            onClick={() => {
                              setCurrentCommitments((current) =>
                                current.includes(commitment)
                                  ? current.filter((item) => item !== commitment)
                                  : [...current, commitment]
                              );
                              setError("");
                            }}
                            type="button"
                          >
                            {commitment}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <fieldset className="mt-6">
                    <legend className="text-sm font-semibold">How does this chapter feel right now?</legend>
                    <p className="mt-1 text-sm text-[#64748b]">Choose every word that feels true.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {emotionalSignalOptions.map((signal) => {
                        const isSelected = currentEmotionalSignals.includes(signal);

                        return (
                          <button
                            aria-pressed={isSelected}
                            className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                              isSelected
                                ? "border-[#ff7a00] bg-[#fff3e8] text-[#8c4309]"
                                : "border-[#bfd3d8] bg-white text-[#405d65] hover:border-[#1689a3] hover:bg-[#f4fafb]"
                            }`}
                            key={signal}
                            onClick={() => {
                              setCurrentEmotionalSignals((current) =>
                                current.includes(signal)
                                  ? current.filter((item) => item !== signal)
                                  : [...current, signal]
                              );
                              setError("");
                            }}
                            type="button"
                          >
                            {signal}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="mt-6 grid gap-5 sm:grid-cols-3">
                    <label>
                      <span className="mb-2 block text-sm font-semibold">Financial urgency</span>
                      <select className="h-12 w-full rounded-xl border border-[#bfd3d8] bg-white px-3 outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]" onChange={(event) => setFinancialUrgency(event.target.value)} value={financialUrgency}>
                        <option value="">Choose one</option>
                        <option value="immediate">Income needed immediately</option>
                        <option value="one_to_three_months">Within 1–3 months</option>
                        <option value="three_to_six_months">Stable for 3–6 months</option>
                        <option value="low_pressure">Low immediate pressure</option>
                      </select>
                    </label>
                    <label>
                      <span className="mb-2 block text-sm font-semibold">Capacity for change</span>
                      <select className="h-12 w-full rounded-xl border border-[#bfd3d8] bg-white px-3 outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]" onChange={(event) => setChangeCapacity(event.target.value)} value={changeCapacity}>
                        <option value="">Choose one</option>
                        <option value="very_limited">Very limited right now</option>
                        <option value="limited">Limited</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                      </select>
                    </label>
                    <label>
                      <span className="mb-2 block text-sm font-semibold">Pivot readiness</span>
                      <select className="h-12 w-full rounded-xl border border-[#bfd3d8] bg-white px-3 outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]" onChange={(event) => setPivotReadiness(event.target.value)} value={pivotReadiness}>
                        <option value="">Choose one</option>
                        <option value="not_ready">Not ready to pivot</option>
                        <option value="exploring">Considering possibilities</option>
                        <option value="preparing">Preparing for a pivot</option>
                        <option value="active">Actively pivoting</option>
                        <option value="forced">Circumstances require a pivot</option>
                      </select>
                    </label>
                  </div>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <label>
                      <span className="mb-2 block text-sm font-semibold">What must your next plan respect?</span>
                      <textarea
                        className="min-h-24 w-full resize-y rounded-xl border border-[#bfd3d8] px-4 py-3 outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                        onChange={(event) => setCurrentConstraints(event.target.value)}
                        placeholder="Time, money, family, health, location, schedule..."
                        value={currentConstraints}
                      />
                    </label>
                    <label>
                      <span className="mb-2 block text-sm font-semibold">
                        What support or resources can you draw on?
                        <span className="font-normal text-[#80909e]"> (optional)</span>
                      </span>
                      <textarea
                        className="min-h-24 w-full resize-y rounded-xl border border-[#bfd3d8] px-4 py-3 outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                        onChange={(event) => setCurrentSupport(event.target.value)}
                        placeholder="People, savings, time, credentials, community, benefits..."
                        value={currentSupport}
                      />
                    </label>
                  </div>
                  {error ? (
                    <p className="mt-4 text-sm text-[#a84c0b]" role="alert">{error}</p>
                  ) : null}
                  <div className="mt-8 flex items-center gap-4">
                    <button
                      className="rounded-xl border border-[#bfd3d8] px-6 py-3 font-semibold text-[#405d65] transition hover:bg-[#eef6f7]"
                      onClick={() => goToPreviousStep(1)}
                      type="button"
                    >
                      Back
                    </button>
                    <button
                      className="rounded-xl bg-[#123f4d] px-7 py-3 font-semibold text-white transition hover:bg-[#ff7a00]"
                      type="submit"
                    >
                      Continue
                    </button>
                  </div>
                  </div>
                </form>
              ) : null}

              {step === 3 ? (
                <div className="flex h-full max-w-3xl flex-col">
                  <header className="shrink-0 border-b border-[#e2ecef] pb-5 pr-24" data-testid="onboarding-step-header">
                    <h2 className="text-3xl font-semibold tracking-[-0.03em]">
                      What do you want your next chapter to make possible?
                    </h2>
                    <p className="mt-3 text-[#64748b]">
                      Choose every goal that matters. Then identify the one you want to organize your first plan around.
                    </p>
                  </header>
                  <div className="min-h-0 flex-1 overflow-y-auto pr-2 pt-6" data-testid="onboarding-step-scroll">
                  {(["Career", "Flexibility & place", "Business", "Life & family"] as const).map((category) => (
                    <fieldset className="mb-7" key={category}>
                      <legend className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1689a3]">
                        {category}
                      </legend>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {goalDirectionOptions
                          .filter((option) => option.category === category)
                          .map((option) => {
                            const isSelected = goalDirections.includes(option.id);

                            return (
                              <button
                                aria-pressed={isSelected}
                                className={`rounded-2xl border p-4 text-left transition ${
                                  isSelected
                                    ? "border-[#ff7a00] bg-[#fff6ed] ring-2 ring-[#ffd7b2]"
                                    : "border-[#c9dde2] bg-white hover:border-[#1689a3] hover:bg-[#f4fafb]"
                                }`}
                                key={option.id}
                                onClick={() => {
                                  const nextDirections = isSelected
                                    ? goalDirections.filter((item) => item !== option.id)
                                    : [...goalDirections, option.id];
                                  setGoalDirections(nextDirections);

                                  if (!isSelected && !primaryGoalDirection) {
                                    setPrimaryGoalDirection(option.id);
                                    setPrimaryIntent(option.intent);
                                  } else if (isSelected && primaryGoalDirection === option.id) {
                                    const nextPrimary = nextDirections[0] ?? null;
                                    setPrimaryGoalDirection(nextPrimary);
                                    setPrimaryIntent(
                                      nextPrimary
                                        ? goalDirectionOptions.find((item) => item.id === nextPrimary)?.intent ?? null
                                        : null
                                    );
                                  }
                                  setError("");
                                }}
                                type="button"
                              >
                                <span className="font-semibold">{option.label}</span>
                                <span className="mt-1 block text-sm leading-5 text-[#64748b]">
                                  {option.detail}
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    </fieldset>
                  ))}
                  {goalDirections.length > 0 ? (
                    <label className="mt-1 block rounded-2xl border border-[#c9dde2] bg-[#f4fafb] p-5">
                      <span className="mb-2 block text-sm font-semibold">
                        Which goal matters most right now?
                      </span>
                      <select
                        className="h-12 w-full rounded-xl border border-[#bfd3d8] bg-white px-4 outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                        onChange={(event) => {
                          const direction = event.target.value as OnboardingGoalDirection;
                          const option = goalDirectionOptions.find((item) => item.id === direction);
                          setPrimaryGoalDirection(direction);
                          setPrimaryIntent(option?.intent ?? null);
                          setError("");
                        }}
                        value={primaryGoalDirection ?? ""}
                      >
                        <option value="">Choose your primary goal</option>
                        {goalDirections.map((direction) => {
                          const option = goalDirectionOptions.find((item) => item.id === direction);
                          return option ? (
                            <option key={direction} value={direction}>{option.label}</option>
                          ) : null;
                        })}
                      </select>
                    </label>
                  ) : null}
                  <h3 className="mt-7 text-xl font-semibold tracking-[-0.02em]">
                    Describe what success would look like
                  </h3>
                  <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_13rem]">
                    <label>
                      <span className="mb-2 block text-sm font-semibold">
                        In your own words <span className="font-normal text-[#80909e]">(optional)</span>
                      </span>
                      <textarea
                        className="min-h-24 w-full resize-y rounded-xl border border-[#bfd3d8] px-4 py-3 outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                        onChange={(event) => setTargetStatement(event.target.value)}
                        placeholder="If this next chapter works, my life and work will..."
                        value={targetStatement}
                      />
                    </label>
                    <label>
                      <span className="mb-2 block text-sm font-semibold">Work preference</span>
                      <select
                        className="h-12 w-full rounded-xl border border-[#bfd3d8] bg-white px-4 outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                        onChange={(event) =>
                          setWorkPreference(
                            event.target.value as typeof workPreference
                          )
                        }
                        value={workPreference}
                      >
                        <option value="flexible">Flexible</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="onsite">On-site</option>
                      </select>
                    </label>
                  </div>
                  {error ? (
                    <p className="mt-4 text-sm text-[#a84c0b]" role="alert">{error}</p>
                  ) : null}
                  <div className="mt-7 flex items-center gap-4">
                    <button
                      className="rounded-xl border border-[#bfd3d8] px-6 py-3 font-semibold text-[#405d65] transition hover:bg-[#eef6f7]"
                      onClick={() => goToPreviousStep(2)}
                      type="button"
                    >
                      Back
                    </button>
                    <button
                      className="rounded-xl bg-[#123f4d] px-7 py-3 font-semibold text-white transition hover:bg-[#ff7a00] focus:outline-none focus:ring-4 focus:ring-[#ffd7b2]"
                      onClick={finishOnboarding}
                      type="button"
                    >
                      Open my workspace
                    </button>
                  </div>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
