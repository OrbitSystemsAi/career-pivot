"use client";

import { useState } from "react";
import { useOSState } from "@/core/state/OSStateProvider";
import { useUser } from "@/core/user/UserProvider";
import { getCareerIntelligence } from "@/modules/career/lib/careerIntelligence";

function fitScore(baseScore: number, index: number) {
  return Math.max(58, baseScore - index * 7);
}

export default function CareerMarket() {
  const { user, activeResumeId, updateCareerPreference } = useUser();
  const { setActiveModule, setActiveView } = useOSState();
  const career = getCareerIntelligence(user, activeResumeId);
  const [showMorePaths, setShowMorePaths] = useState(false);

  if (!career.hasCompletedGoal) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white p-8">
        <section className="flex min-h-[325px] w-full max-w-3xl flex-col items-center justify-center rounded-3xl border border-[#c8dfe9] bg-[linear-gradient(145deg,#f8fcfe,#e3f3f9)] px-10 py-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#173a46] text-xl text-white">
            ➊
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[#102f39]">
            Paths begin with a completed Career Goal
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Complete your goal and AI guidance first. Then compare possible
            routes, select one or more, and use them to build your plan.
          </p>
          <div className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-[#2b6874]">
            Goal → Paths → Plan · 0 of 1 complete
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveModule("career");
              setActiveView("goal");
            }}
            className="mt-7 rounded-xl bg-[#164858] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#f28c28] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168391] focus-visible:ring-offset-2"
          >
            Complete Career Goal
          </button>
        </section>
      </div>
    );
  }

  const selectedCareer = career.selectedCareer;
  const baseScore = selectedCareer?.match ?? 72;
  const detectedSignals = selectedCareer?.evidence ?? [];
  const missingSignals =
    selectedCareer?.keywords.filter(
      (keyword) => !detectedSignals.includes(keyword)
    ) ?? [];
  const visibleCareerOptions = showMorePaths
    ? career.careerOptions
    : career.careerOptions.slice(0, 5);

  function toggleCareer(optionId: string) {
    const currentIds = career.selectedCareers.map((option) => option.id);
    const selected = currentIds.includes(optionId);
    const nextIds = selected
      ? currentIds.filter((id) => id !== optionId)
      : [...currentIds, optionId];

    updateCareerPreference({
      selectedCareerIds: nextIds,
      selectedCareerId: nextIds[0],
      selectionConfirmedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-white p-6 text-[#173a46]">
      <header className="rounded-3xl bg-[linear-gradient(135deg,#102f39,#2b6874)] p-7 text-white">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b9d0d5]">
          Goal-derived path options
        </div>
        <div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              {selectedCareer?.label ?? "Choose a path"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d3e1e4]">
              Compare routes that could achieve your goal and select one or
              more before committing to a plan. A resume can refine the
              evidence later, but it does not block this decision.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-3">
            <div className="text-3xl font-semibold">{baseScore}%</div>
            <div className="mt-1 text-xs text-[#d3e1e4]">goal alignment</div>
          </div>
        </div>
      </header>

      <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-[#afd2e7] bg-[#eef8fd] p-5">
          <div className="text-xs uppercase tracking-wide text-slate-500">Career Goal</div>
          <div className="mt-3 line-clamp-2 text-sm font-semibold">{career.completedGoal?.title}</div>
        </article>
        <article className="rounded-2xl border border-[#69c8e8] bg-[#dff5fb] p-5">
          <div className="text-xs uppercase tracking-wide text-slate-500">Possible paths</div>
          <div className="mt-3 text-3xl font-semibold">{career.careerOptions.length}</div>
        </article>
        <article className="rounded-2xl border border-[#9fc1c8] bg-[#e8f2f3] p-5">
          <div className="text-xs uppercase tracking-wide text-slate-500">Goal signals</div>
          <div className="mt-3 text-3xl font-semibold">{detectedSignals.length}</div>
        </article>
        <article className="rounded-2xl border border-[#f5bd83] bg-[#fff3e7] p-5">
          <div className="text-xs uppercase tracking-wide text-slate-500">Questions to verify</div>
          <div className="mt-3 text-3xl font-semibold">{missingSignals.length}</div>
        </article>
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-3xl border border-[#c8dfe9] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Possible route outcomes</h3>
            <span className="text-xs text-slate-500">goal alignment</span>
          </div>
          <div className="mt-5 space-y-5">
            {career.nextTitles.slice(0, 4).map((title, index) => {
              const score = fitScore(baseScore, index);
              return (
                <div key={title}>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium">{title}</span>
                    <span className="text-slate-500">{score}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8f2f3]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#168391,#35afe6)]"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-[#c8dfe9] bg-[#f8fcfe] p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Path rationale</h3>
          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Found in your goal
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {detectedSignals.length > 0 ? (
                detectedSignals.map((signal) => (
                  <span key={signal} className="rounded-full bg-[#dff5fb] px-3 py-1.5 text-xs text-[#126174]">
                    {signal}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">Suggested from your selected goal type.</span>
              )}
            </div>
          </div>
          <div className="mt-6 border-t border-[#c8dfe9] pt-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Questions to verify before planning
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {missingSignals.slice(0, 6).map((signal) => (
                <span key={signal} className="rounded-full bg-[#fff3e7] px-3 py-1.5 text-xs text-[#9a5715]">
                  {signal}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-3xl border border-[#c8dfe9] bg-white p-6 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Paths toward this goal</h3>
            <p className="mt-1 text-xs text-slate-500">
              Select one or more paths to create grouped Opportunity feeds.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#126174]">
            {career.selectedCareers.length} selected
          </span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visibleCareerOptions.map((option) => {
            const selected = career.selectedCareers.some(
              (careerOption) => careerOption.id === option.id
            );

            return (
              <button
                type="button"
                key={option.id}
                aria-pressed={selected}
                onClick={() => toggleCareer(option.id)}
                className={`rounded-2xl border p-4 text-left transition hover:border-[#168391] hover:bg-[#f3f8f8] focus:outline-none focus:ring-4 focus:ring-[#e8f2f3] ${
                  selected
                    ? "border-[#168391] bg-[#e8f2f3] shadow-[inset_4px_0_0_#f28c28]"
                    : "border-[#d6e8ea] bg-white"
                }`}
              >
                <div className="text-sm font-semibold">{option.label}</div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{option.evidence.length} matched signals</span>
                  <span className="font-semibold text-[#126174]">
                    {option.match}% aligned
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {career.careerOptions.length > 5 ? (
          <div className="mt-6 flex justify-center border-t border-[#d6e8ea] pt-5">
            <button
              type="button"
              onClick={() => setShowMorePaths((current) => !current)}
              className="rounded-xl bg-[#164858] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#f28c28]"
            >
              {showMorePaths ? "View Less" : "View More"}
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
