"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ResumeExperience } from "@/core/resumeParsing/resumeStructureTypes";

type ExperienceTimelineTileProps = {
  hasResume: boolean;
  roles: ResumeExperience[];
  onSaveRoles: (roles: ResumeExperience[]) => void;
};

type DialogState =
  | { mode: "edit"; role: ResumeExperience }
  | { mode: "add"; insertionIndex: number }
  | null;

const nodeColors = ["#164b68", "#248ba3", "#36b7df", "#2458c6", "#ff7a00"];

function getYear(value?: string) {
  return value?.match(/\b(?:19|20)\d{2}\b/)?.[0];
}

function getStartTime(role: ResumeExperience) {
  const year = Number(getYear(role.startDate));
  return Number.isFinite(year) && year > 0 ? year : Number.MAX_SAFE_INTEGER;
}

function toMonthValue(value?: string) {
  if (!value || /present|current/i.test(value)) return "";
  const isoMonth = value.match(/((?:19|20)\d{2})-(0[1-9]|1[0-2])/);
  if (isoMonth) return `${isoMonth[1]}-${isoMonth[2]}`;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function emptyRole(): ResumeExperience {
  return {
    id: `experience-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    company: "",
    title: "",
    startDate: "",
    endDate: "Present",
    bullets: [],
    rawLines: [],
  };
}

function sortNewestFirst(roles: ResumeExperience[]) {
  return roles.toSorted((first, second) => {
    const firstCurrent = /present|current/i.test(first.endDate ?? "");
    const secondCurrent = /present|current/i.test(second.endDate ?? "");
    if (firstCurrent !== secondCurrent) return secondCurrent ? 1 : -1;
    return getStartTime(second) - getStartTime(first);
  });
}

function ExperienceDialog({
  dialog,
  onClose,
  onDelete,
  onSave,
}: {
  dialog: NonNullable<DialogState>;
  onClose: () => void;
  onDelete: (roleId: string) => void;
  onSave: (role: ResumeExperience) => void;
}) {
  const [draft, setDraft] = useState<ResumeExperience>(() =>
    dialog.mode === "edit" ? { ...dialog.role } : emptyRole(),
  );
  const [isCurrent, setIsCurrent] = useState(() =>
    /present|current/i.test(draft.endDate ?? ""),
  );
  const [confirmDelete, setConfirmDelete] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const updateDraft = (field: keyof ResumeExperience, value: string | string[]) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const save = () => {
    const title = draft.title.trim();
    const company = draft.company.trim();
    if (!title || !company) return;

    const nextRole = {
      ...draft,
      title,
      company,
      endDate: isCurrent ? "Present" : draft.endDate,
      rawLines: [
        title,
        company,
        [draft.startDate, isCurrent ? "Present" : draft.endDate].filter(Boolean).join(" - "),
        ...draft.bullets,
      ].filter(Boolean),
    };
    onSave(nextRole);
  };

  return createPortal(
    <div
      aria-label="Experience editor backdrop"
      className="fixed inset-0 z-[1000] grid place-items-center overflow-y-auto bg-[#0f3040]/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section
        aria-labelledby="experience-dialog-title"
        aria-modal="true"
        className="w-full max-w-2xl rounded-[1.75rem] bg-white p-6 text-[#123743] shadow-2xl sm:p-8"
        role="dialog"
      >
        <header className="flex items-start justify-between gap-5">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#248ba3]">
              {dialog.mode === "edit" ? "Career history" : "New experience"}
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-.035em]" id="experience-dialog-title">
              {dialog.mode === "edit" ? "Edit this job" : "Add a job"}
            </h2>
          </div>
          <button
            aria-label="Close experience editor"
            className="grid size-9 place-items-center rounded-full text-xl text-[#78909a] transition hover:bg-[#eef5f7] hover:text-[#ff7a00]"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-[#294653]">
            Job title
            <input
              className="mt-2 w-full rounded-xl border border-[#bdd3db] px-4 py-3 text-sm outline-none transition focus:border-[#248ba3] focus:ring-4 focus:ring-[#36b7df]/15"
              onChange={(event) => updateDraft("title", event.target.value)}
              ref={titleRef}
              required
              value={draft.title}
            />
          </label>
          <label className="text-xs font-semibold text-[#294653]">
            Company
            <input
              className="mt-2 w-full rounded-xl border border-[#bdd3db] px-4 py-3 text-sm outline-none transition focus:border-[#248ba3] focus:ring-4 focus:ring-[#36b7df]/15"
              onChange={(event) => updateDraft("company", event.target.value)}
              required
              value={draft.company}
            />
          </label>
          <label className="text-xs font-semibold text-[#294653]">
            Start date
            <input
              className="mt-2 w-full rounded-xl border border-[#bdd3db] px-4 py-3 text-sm outline-none transition focus:border-[#248ba3] focus:ring-4 focus:ring-[#36b7df]/15"
              onChange={(event) => updateDraft("startDate", event.target.value)}
              type="month"
              value={toMonthValue(draft.startDate)}
            />
          </label>
          <label className="text-xs font-semibold text-[#294653]">
            End date
            <input
              className="mt-2 w-full rounded-xl border border-[#bdd3db] px-4 py-3 text-sm outline-none transition focus:border-[#248ba3] focus:ring-4 focus:ring-[#36b7df]/15 disabled:bg-[#f2f6f7] disabled:text-[#9aadb4]"
              disabled={isCurrent}
              onChange={(event) => updateDraft("endDate", event.target.value)}
              type="month"
              value={isCurrent ? "" : toMonthValue(draft.endDate)}
            />
          </label>
        </div>

        <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 text-sm text-[#526b7f]">
          <input
            checked={isCurrent}
            className="size-4 accent-[#248ba3]"
            onChange={(event) => setIsCurrent(event.target.checked)}
            type="checkbox"
          />
          I currently work here
        </label>

        <label className="mt-5 block text-xs font-semibold text-[#294653]">
          Achievements <span className="font-normal text-[#78909a]">— one per line</span>
          <textarea
            className="mt-2 min-h-32 w-full resize-y rounded-xl border border-[#bdd3db] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#248ba3] focus:ring-4 focus:ring-[#36b7df]/15"
            onChange={(event) =>
              updateDraft(
                "bullets",
                event.target.value.split("\n").map((line) => line.trim()).filter(Boolean),
              )
            }
            value={draft.bullets.join("\n")}
          />
        </label>

        <footer className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            {dialog.mode === "edit" ? (
              <button
                className={`text-sm font-semibold transition ${
                  confirmDelete ? "text-red-600" : "text-[#a94312] hover:text-red-600"
                }`}
                onClick={() => {
                  if (confirmDelete) onDelete(draft.id);
                  else setConfirmDelete(true);
                }}
                type="button"
              >
                {confirmDelete ? "Confirm delete" : "Delete job"}
              </button>
            ) : null}
          </div>
          <div className="flex gap-3">
            <button
              className="rounded-xl px-5 py-3 text-sm font-semibold text-[#526b7f] transition hover:bg-[#eef5f7]"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-xl bg-[#164b68] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#ff7a00] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!draft.title.trim() || !draft.company.trim()}
              onClick={save}
              type="button"
            >
              Save job
            </button>
          </div>
        </footer>
      </section>
    </div>,
    document.body,
  );
}

export default function ExperienceTimelineTile({
  hasResume,
  roles,
  onSaveRoles,
}: ExperienceTimelineTileProps) {
  const [dialog, setDialog] = useState<DialogState>(null);
  const timelineRoles = useMemo(
    () =>
      roles
        .filter((role) => Boolean(getYear(role.startDate)))
        .map((role, index) => ({ role, index }))
        .toSorted((first, second) => {
          const difference = getStartTime(first.role) - getStartTime(second.role);
          return difference || second.index - first.index;
        })
        .map(({ role }) => role),
    [roles],
  );

  const saveRole = (nextRole: ResumeExperience) => {
    const nextRoles =
      dialog?.mode === "edit"
        ? roles.map((role) => (role.id === nextRole.id ? nextRole : role))
        : [...roles, nextRole];
    onSaveRoles(sortNewestFirst(nextRoles));
    setDialog(null);
  };

  const deleteRole = (roleId: string) => {
    onSaveRoles(roles.filter((role) => role.id !== roleId));
    setDialog(null);
  };

  return (
    <article className="relative min-h-[12rem] w-full min-w-0 max-w-full overflow-hidden bg-white px-6 py-5 text-[#123743]">
      <header>
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#567987]">
          Experience
        </div>
      </header>

      {hasResume && timelineRoles.length > 0 ? (
        <div
          aria-label="Career experience timeline"
          className="scrollbar-none mt-3 w-full min-w-0 max-w-full overflow-x-auto overflow-y-visible px-1 pb-24 pt-1"
          role="region"
          tabIndex={0}
        >
          <ol
            className="relative mx-auto flex w-max items-start before:absolute before:left-2 before:right-2 before:top-[1.3rem] before:h-px before:bg-[#b8cbd1]"
            style={{ width: `${Math.max(300, timelineRoles.length * 74 + (timelineRoles.length + 1) * 16)}px` }}
          >
            {timelineRoles.map((role, index) => {
              const startYear = getYear(role.startDate) ?? "—";
              const framePosition =
                index === 0
                  ? "left-0"
                  : index === timelineRoles.length - 1
                    ? "right-0"
                    : "left-1/2 -translate-x-1/2";

              return (
                <li className="contents" key={role.id}>
                  {index === 0 ? (
                    <div className="group/add relative z-20 grid h-11 w-4 shrink-0 place-items-center">
                      <button
                        aria-label="Add experience before the first job"
                        className="grid size-5 place-items-center rounded-full bg-white text-xs font-semibold text-[#164b68] opacity-0 ring-1 ring-[#248ba3] transition hover:bg-[#ff7a00] hover:text-white hover:ring-[#ff7a00] focus:opacity-100 group-hover/add:opacity-100"
                        onClick={() => setDialog({ mode: "add", insertionIndex: 0 })}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  ) : null}

                  <div className="group/node relative z-10 min-w-16 flex-1 text-center">
                    <button
                      aria-label={`Show ${role.title || "job"} at ${role.company || "company"}`}
                      className="relative z-20 mx-auto grid size-11 place-items-center rounded-full text-[11px] font-semibold text-white shadow-[0_4px_10px_rgba(15,48,64,.16)] outline-none transition duration-200 hover:scale-105 focus:scale-105 focus:ring-4 focus:ring-[#36b7df]/25"
                      style={{ backgroundColor: nodeColors[index % nodeColors.length] }}
                      type="button"
                    >
                      {startYear}
                    </button>

                    <button
                      className={`pointer-events-none absolute top-[2.7rem] z-30 flex h-[5.5rem] w-48 flex-col justify-center rounded-xl bg-white px-4 text-left opacity-0 shadow-[0_10px_30px_rgba(15,48,64,.2)] ring-1 ring-[#c7dbe2] transition duration-200 group-focus-within/node:pointer-events-auto group-focus-within/node:opacity-100 group-hover/node:pointer-events-auto group-hover/node:opacity-100 ${framePosition}`}
                      onClick={() => setDialog({ mode: "edit", role })}
                      type="button"
                    >
                      <span className="line-clamp-2 text-xs font-semibold leading-snug text-[#123743]">
                        {role.title || "Untitled role"}
                      </span>
                      <span className="mt-1 line-clamp-2 text-[10px] leading-snug text-[#647f8b]">
                        {role.company || "Organization"}
                      </span>
                      <span className="mt-2 text-[9px] font-semibold uppercase tracking-[.12em] text-[#ff7a00]">
                        Edit job
                      </span>
                    </button>
                  </div>

                  <div className="group/add relative z-20 grid h-11 w-4 shrink-0 place-items-center">
                    <button
                      aria-label={index === timelineRoles.length - 1 ? "Add experience after the last job" : "Add experience between jobs"}
                      className="grid size-5 place-items-center rounded-full bg-white text-xs font-semibold text-[#164b68] opacity-0 ring-1 ring-[#248ba3] transition hover:bg-[#ff7a00] hover:text-white hover:ring-[#ff7a00] focus:opacity-100 group-hover/add:opacity-100"
                      onClick={() => setDialog({ mode: "add", insertionIndex: index + 1 })}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ) : (
        <div className="mt-10 text-sm font-medium text-[#78909a]">
          Upload a résumé to build your experience timeline.
        </div>
      )}

      {dialog ? (
        <ExperienceDialog
          dialog={dialog}
          onClose={() => setDialog(null)}
          onDelete={deleteRole}
          onSave={saveRole}
        />
      ) : null}
    </article>
  );
}
