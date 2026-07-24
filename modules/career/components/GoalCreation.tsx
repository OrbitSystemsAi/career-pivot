"use client";

import { FormEvent, useMemo, useState } from "react";
import { useUser } from "@/core/user/UserProvider";
import type {
  GoalPace,
  GoalType,
  SuccessCriterion,
  UserGoal,
} from "@/core/user/userTypes";
import {
  buildGoalGuidance,
  createGoalFromDraft,
  type GoalDraft,
} from "@/modules/career/lib/goalGuidance";

const goalTypes: Array<{ value: GoalType; label: string }> = [
  { value: "employment", label: "A job or role" },
  { value: "business", label: "A business" },
  { value: "creative", label: "Creative work" },
  { value: "education", label: "Education" },
  { value: "caregiving", label: "Caregiving" },
  { value: "lifestyle", label: "A lifestyle change" },
  { value: "portfolio", label: "Multiple paths" },
  { value: "retirement", label: "Retirement" },
  { value: "custom", label: "Something else" },
];

const initialDraft: GoalDraft = {
  statement: "",
  goalType: "employment",
  motivation: "",
  pace: "balanced",
  constraints: [],
  userSuccessCriteria: [],
};

function numberOrUndefined(value: string) {
  const number = Number(value);
  return value && Number.isFinite(number) ? number : undefined;
}

function draftFromGoal(goal: UserGoal): GoalDraft {
  return {
    statement: goal.statement,
    goalType: goal.goalTypes[0] ?? "custom",
    motivation: goal.motivation,
    pace: goal.pace,
    requestedTimelineMonths: goal.requestedTimelineMonths,
    availableHoursPerWeek: goal.availableHoursPerWeek,
    urgencyReason: goal.urgencyReason,
    constraints: goal.constraints,
    userSuccessCriteria: goal.successCriteria
      .filter((criterion) => criterion.source === "user")
      .map((criterion) => criterion.label),
  };
}

function ratingLabel(rating: UserGoal["guidance"]["rating"]) {
  return rating.replaceAll("_", " ");
}

export default function GoalCreation() {
  const { user, addGoal, updateGoal, deleteGoal } = useUser();
  const currentGoal = user.goals[0];
  const [editingGoal, setEditingGoal] = useState<UserGoal | undefined>();
  const [draft, setDraft] = useState<GoalDraft>(initialDraft);
  const [constraintInput, setConstraintInput] = useState("");
  const [criterionInput, setCriterionInput] = useState("");
  const [generatedCriteria, setGeneratedCriteria] = useState<SuccessCriterion[]>([]);
  const [showGuidance, setShowGuidance] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const preview = useMemo(
    () => buildGoalGuidance(draft, user.age),
    [draft, user.age]
  );
  const isEditing = Boolean(editingGoal);
  const showOverview = Boolean(currentGoal) && !isEditing && !showGuidance;

  function updateDraft<Key extends keyof GoalDraft>(key: Key, value: GoalDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function addConstraint() {
    const value = constraintInput.trim();
    if (!value || draft.constraints.includes(value)) return;
    updateDraft("constraints", [...draft.constraints, value]);
    setConstraintInput("");
  }

  function addCriterion() {
    const value = criterionInput.trim();
    if (!value || draft.userSuccessCriteria.includes(value)) return;
    updateDraft("userSuccessCriteria", [...draft.userSuccessCriteria, value]);
    setCriterionInput("");
  }

  function generateGuidance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGeneratedCriteria(preview.criteria);
    setShowGuidance(true);
  }

  function saveGoal() {
    const goal = createGoalFromDraft(draft, user.age);
    const acceptedCriteria = generatedCriteria.filter((criterion) => criterion.accepted);
    const finalGoal: UserGoal = {
      ...goal,
      id: editingGoal?.id ?? goal.id,
      createdAt: editingGoal?.createdAt ?? goal.createdAt,
      successCriteria: acceptedCriteria,
    };

    if (editingGoal) updateGoal(finalGoal);
    else addGoal(finalGoal);

    setEditingGoal(undefined);
    setShowGuidance(false);
    setDraft(initialDraft);
  }

  function beginEdit(goal: UserGoal) {
    const nextDraft = draftFromGoal(goal);
    setEditingGoal(goal);
    setDraft(nextDraft);
    setGeneratedCriteria(buildGoalGuidance(nextDraft, user.age).criteria);
    setShowGuidance(true);
    setConfirmingDelete(false);
  }

  function resetEditor() {
    setEditingGoal(undefined);
    setDraft(initialDraft);
    setGeneratedCriteria([]);
    setShowGuidance(false);
    setConfirmingDelete(false);
  }

  function startAnotherGoal() {
    resetEditor();
  }

  function confirmDeleteGoal(goalId: string) {
    deleteGoal(goalId);
    resetEditor();
  }

  if (showOverview && currentGoal) {
    const acceptedCriteria = currentGoal.successCriteria.filter(
      (criterion) => criterion.accepted
    );

    return (
      <div className="h-full overflow-y-auto bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Your direction
              </div>
              <h2 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950">
                {currentGoal.statement}
              </h2>
              {currentGoal.motivation && (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                  {currentGoal.motivation}
                </p>
              )}
            </div>
            <div className="flex shrink-0 flex-wrap justify-end gap-2">
              {confirmingDelete ? (
                <>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-blue-50"
                  >
                    Keep goal
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmDeleteGoal(currentGoal.id)}
                    className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    Confirm delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => beginEdit(currentGoal)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50"
                  >
                    Review goal
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(true)}
                    className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                  >
                    Delete goal
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-2xl bg-blue-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-900">AI planning guidance</h3>
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold capitalize text-blue-700">
                  {ratingLabel(currentGoal.guidance.rating)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {currentGoal.guidance.summary}
              </p>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-slate-900">Accepted success criteria</h3>
              <div className="mt-3 space-y-2">
                {acceptedCriteria.map((criterion) => (
                  <div key={criterion.id} className="flex gap-3 rounded-xl border border-slate-200 px-4 py-3">
                    <span className="mt-0.5 text-emerald-600">✓</span>
                    <div>
                      <div className="text-sm text-slate-700">{criterion.label}</div>
                      <div className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
                        {criterion.source === "ai" ? "AI suggested" : "You defined"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-5">
            <button type="button" onClick={startAnotherGoal} className="text-xs font-semibold text-blue-700 hover:text-blue-900">
              Create another goal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-5">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
        <form onSubmit={generateGuidance} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            What do you want your life and work to look like?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Describe the outcome in your own words. It does not need to be a traditional job.
          </p>

          <label className="mt-7 block text-xs font-semibold text-slate-700">
            Your goal
            <textarea
              required
              value={draft.statement}
              onChange={(event) => updateDraft("statement", event.target.value)}
              placeholder="I want to leave corporate work and build a travel content business."
              className="mt-2 min-h-28 w-full resize-y rounded-2xl border border-slate-200 px-4 py-3 text-sm font-normal leading-6 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
            />
          </label>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">
              Closest direction
              <select value={draft.goalType} onChange={(event) => updateDraft("goalType", event.target.value as GoalType)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 outline-none focus:border-blue-400">
                {goalTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-700">
              Planning pace
              <select value={draft.pace} onChange={(event) => updateDraft("pace", event.target.value as GoalPace)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 outline-none focus:border-blue-400">
                <option value="explore">Explore first</option>
                <option value="gradual">Gradual</option>
                <option value="balanced">Balanced</option>
                <option value="accelerated">Accelerated</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>
          </div>

          <label className="mt-5 block text-xs font-semibold text-slate-700">
            Why does this matter to you?
            <input value={draft.motivation} onChange={(event) => updateDraft("motivation", event.target.value)} placeholder="More autonomy, time with family, income security…" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal text-slate-900 outline-none focus:border-blue-400" />
          </label>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">Desired months<input type="number" min="1" max="600" value={draft.requestedTimelineMonths ?? ""} onChange={(event) => updateDraft("requestedTimelineMonths", numberOrUndefined(event.target.value))} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-400" /></label>
            <label className="text-xs font-semibold text-slate-700">Hours per week<input type="number" min="1" max="100" value={draft.availableHoursPerWeek ?? ""} onChange={(event) => updateDraft("availableHoursPerWeek", numberOrUndefined(event.target.value))} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-400" /></label>
          </div>

          <label className="mt-5 block text-xs font-semibold text-slate-700">Urgency or situation<input value={draft.urgencyReason ?? ""} onChange={(event) => updateDraft("urgencyReason", event.target.value)} placeholder="My current role may be replaced by AI." className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-400" /></label>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">Non-negotiables or constraints</label>
              <div className="mt-2 flex gap-2"><input value={constraintInput} onChange={(event) => setConstraintInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addConstraint(); } }} placeholder="Must remain in Florida" className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-blue-400" /><button type="button" onClick={addConstraint} className="rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-blue-50">Add</button></div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Your success criteria</label>
              <div className="mt-2 flex gap-2"><input value={criterionInput} onChange={(event) => setCriterionInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addCriterion(); } }} placeholder="Earn at least $5,000 monthly" className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-blue-400" /><button type="button" onClick={addCriterion} className="rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-blue-50">Add</button></div>
            </div>
          </div>

          {(draft.constraints.length > 0 || draft.userSuccessCriteria.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {draft.constraints.map((item) => <button type="button" key={item} onClick={() => updateDraft("constraints", draft.constraints.filter((value) => value !== item))} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-600">{item} ×</button>)}
              {draft.userSuccessCriteria.map((item) => <button type="button" key={item} onClick={() => updateDraft("userSuccessCriteria", draft.userSuccessCriteria.filter((value) => value !== item))} className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700">{item} ×</button>)}
            </div>
          )}

          <button type="submit" className="mt-7 h-11 rounded-xl bg-slate-950 px-5 text-xs font-semibold text-white transition hover:bg-blue-700">
            Generate planning guidance
          </button>
        </form>

        <aside className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          {!showGuidance ? (
            <div className="flex h-full min-h-96 flex-col justify-between">
              <div><h3 className="text-lg font-semibold">Guidance, not a gatekeeper</h3><p className="mt-3 text-sm leading-6 text-slate-300">Orbit will compare your requested outcome and timing with known requirements, your available time, and your constraints. You keep control of the final goal.</p></div>
              <div className="border-t border-slate-700 pt-5 text-xs leading-5 text-slate-400">Life-stage context comes from your editable profile and informs guidance without acting as a gatekeeper.</div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-3"><h3 className="text-lg font-semibold">Planning guidance</h3><span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold capitalize text-blue-200">{ratingLabel(preview.guidance.rating)}</span></div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{preview.guidance.summary}</p>
              <div className="mt-6"><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Success criteria</div><div className="mt-3 space-y-2">{generatedCriteria.map((criterion) => <label key={criterion.id} className="flex cursor-pointer gap-3 rounded-xl bg-white/5 px-3 py-3"><input type="checkbox" checked={criterion.accepted} onChange={() => setGeneratedCriteria((items) => items.map((item) => item.id === criterion.id ? { ...item, accepted: !item.accepted } : item))} className="mt-0.5 accent-blue-500" /><span><span className="block text-xs leading-5 text-slate-100">{criterion.label}</span><span className="mt-1 block text-[10px] uppercase tracking-wide text-slate-500">{criterion.source === "ai" ? "AI suggested" : "You defined"}</span></span></label>)}</div></div>
              <div className="mt-6"><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Assumptions to verify</div><ul className="mt-2 space-y-2 text-xs leading-5 text-slate-300">{preview.guidance.assumptions.map((item) => <li key={item}>• {item}</li>)}</ul></div>
              <div className="mt-6"><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Alternative worth comparing</div><p className="mt-2 text-xs leading-5 text-slate-300">{preview.guidance.alternatives[0]}</p></div>
              <div className="mt-7 grid gap-2">
                <button type="button" onClick={saveGoal} disabled={!generatedCriteria.some((criterion) => criterion.accepted)} className="h-11 w-full rounded-xl bg-blue-500 px-4 text-xs font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40">{isEditing ? "Save updated goal" : "Accept goal and guidance"}</button>
                {isEditing ? (
                  <button type="button" onClick={resetEditor} className="h-10 w-full rounded-xl border border-slate-600 px-4 text-xs font-semibold text-slate-200 hover:bg-white/10">
                    Cancel edit
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
