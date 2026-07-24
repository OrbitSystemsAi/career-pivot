"use client";

import { useEffect, useId, useState } from "react";
import ModalPortal from "@/core/ui/ModalPortal";

type CoreStrengthsTileProps = {
  strengths: string[];
  onSave: (strengths: string[]) => void;
};

const wordStyles = [
  "text-[clamp(1.25rem,2vw,2rem)] font-black tracking-[-.055em] -rotate-2",
  "text-[clamp(.7rem,.85vw,.85rem)] font-medium uppercase tracking-[.14em] rotate-1",
  "text-[clamp(1.8rem,2.8vw,2.8rem)] font-semibold leading-[.82] tracking-[-.07em] text-[#ff7a00] rotate-2",
  "text-[clamp(.72rem,.9vw,.9rem)] font-semibold uppercase tracking-[.12em] [writing-mode:vertical-rl] rotate-180 max-h-20",
  "text-[clamp(1rem,1.35vw,1.35rem)] font-light italic -rotate-1",
  "text-[clamp(1.15rem,1.65vw,1.65rem)] font-bold tracking-[-.035em] rotate-1",
  "text-[clamp(.68rem,.82vw,.82rem)] font-medium uppercase tracking-[.16em]",
];

function getDisplayStrengths(strengths: string[]) {
  return strengths
    .flatMap((strength) => strength.split(/\s*[·|•,;]\s*/))
    .map((strength) => strength.trim())
    .filter((strength) => strength.length > 1 && strength.length <= 42)
    .filter((strength, index, values) => values.indexOf(strength) === index)
    .slice(0, 7);
}

export default function CoreStrengthsTile({
  strengths,
  onSave,
}: CoreStrengthsTileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftStrengths, setDraftStrengths] = useState<string[]>([]);
  const dialogTitleId = useId();
  const displayStrengths = getDisplayStrengths(strengths);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  function openEditor() {
    setDraftStrengths(strengths.length > 0 ? strengths : [""]);
    setIsOpen(true);
  }

  function updateStrength(index: number, value: string) {
    setDraftStrengths((current) =>
      current.map((strength, strengthIndex) =>
        strengthIndex === index ? value : strength,
      ),
    );
  }

  function deleteStrength(index: number) {
    setDraftStrengths((current) =>
      current.filter((_, strengthIndex) => strengthIndex !== index),
    );
  }

  function saveStrengths() {
    const cleanedStrengths = draftStrengths
      .map((strength) => strength.trim())
      .filter(Boolean)
      .filter((strength, index, values) => values.indexOf(strength) === index);

    onSave(cleanedStrengths);
    setIsOpen(false);
  }

  return (
    <>
      <article className="relative h-full min-h-36 overflow-hidden rounded-2xl bg-white">
        <div className="group relative h-full min-h-36 w-full overflow-hidden rounded-2xl text-left text-[#123743]">
          <div className="h-full p-6 transition duration-300 group-hover:scale-[.992] group-hover:blur-[2.5px] group-focus-within:scale-[.992] group-focus-within:blur-[2.5px]">
            <div className="flex items-start justify-between gap-4">
              <div className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#567987]">
                Strengths
              </div>
              <div className="text-[clamp(3.8rem,6vw,7rem)] font-semibold leading-[.72] tracking-[-.09em]">
                {strengths.length}
              </div>
            </div>

            <div className="mt-10 flex min-h-20 max-w-[28rem] flex-wrap items-center gap-x-3 gap-y-1.5 leading-none">
              {(displayStrengths.length > 0
                ? displayStrengths
                : ["Add your strengths"]
              ).map((strength, index) => (
                <span
                  className={wordStyles[index % wordStyles.length]}
                  key={`${strength}-${index}`}
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>

          <button
            aria-label="Edit strengths"
            className="absolute left-6 top-10 z-10 text-[9px] font-semibold uppercase tracking-[.15em] text-[#248ba3] opacity-0 transition hover:text-[#ff7a00] focus:opacity-100 focus:text-[#ff7a00] group-hover:opacity-100 group-focus-within:opacity-100"
            onClick={openEditor}
            type="button"
          >
            Edit
          </button>
        </div>
      </article>

      {isOpen ? (
        <ModalPortal>
        <div
          aria-labelledby={dialogTitleId}
          aria-modal="true"
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#092736]/65 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setIsOpen(false);
            }
          }}
          role="dialog"
        >
          <div className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <header className="flex items-start justify-between gap-6 border-b border-[#dce9ed] px-7 py-6">
              <div>
                <h2
                  className="text-3xl font-semibold tracking-[-.045em] text-[#123743]"
                  id={dialogTitleId}
                >
                  Strengths
                </h2>
                <p className="mt-1 text-sm text-[#64748b]">
                  Refine the strengths that define your professional signal.
                </p>
              </div>
              <button
                aria-label="Close strengths editor"
                className="text-sm font-semibold text-[#64748b] transition hover:text-[#ff7a00]"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Close
              </button>
            </header>

            <ol className="min-h-0 flex-1 space-y-3 overflow-y-auto px-7 py-6 [content-visibility:auto]">
              {draftStrengths.map((strength, index) => (
                <li
                  className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3"
                  key={`strength-${index}`}
                >
                  <span className="text-right text-xs font-semibold tabular-nums tracking-[.12em] text-[#1689a3]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <input
                    autoFocus={index === 0}
                    className="h-12 min-w-0 rounded-xl border border-[#c6dce2] px-4 text-sm text-[#123743] outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                    onChange={(event) => updateStrength(index, event.target.value)}
                    placeholder="Enter a strength"
                    value={strength}
                  />
                  <button
                    aria-label={`Delete strength ${index + 1}`}
                    className="px-2 py-3 text-xs font-semibold text-[#78909a] transition hover:text-[#d65400]"
                    onClick={() => deleteStrength(index)}
                    type="button"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ol>

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#dce9ed] px-7 py-5">
              <button
                className="rounded-xl border border-[#bfd3d8] px-5 py-3 text-sm font-semibold text-[#294653] transition hover:border-[#1689a3] hover:bg-[#eef8fa]"
                onClick={() => setDraftStrengths((current) => [...current, ""])}
                type="button"
              >
                Add strength
              </button>
              <div className="flex items-center gap-3">
                <button
                  className="px-4 py-3 text-sm font-semibold text-[#64748b] transition hover:text-[#ff7a00]"
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded-xl bg-[#123f4d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#ff7a00]"
                  onClick={saveStrengths}
                  type="button"
                >
                  Save strengths
                </button>
              </div>
            </footer>
          </div>
        </div>
        </ModalPortal>
      ) : null}
    </>
  );
}
