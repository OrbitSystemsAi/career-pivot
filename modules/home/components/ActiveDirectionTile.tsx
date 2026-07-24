"use client";

import { useEffect, useId, useState } from "react";
import ModalPortal from "@/core/ui/ModalPortal";
import type { OnboardingGoalDirection } from "@/core/user/userTypes";

type DirectionTileProps = {
  labels: Record<OnboardingGoalDirection, string>;
  onSave: (directions: OnboardingGoalDirection[]) => void;
  selectedDirections: OnboardingGoalDirection[];
};

const stepPositions = [
  "bottom-0 left-0 w-[31%]",
  "bottom-[28%] left-[34%] w-[31%]",
  "right-0 top-0 w-[31%]",
];

const stepColors = ["#36b7df", "#2458c6", "#ff7a00"];

export default function ActiveDirectionTile({
  labels,
  onSave,
  selectedDirections,
}: DirectionTileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftDirections, setDraftDirections] = useState<OnboardingGoalDirection[]>([]);
  const dialogTitleId = useId();
  const visibleDirections = selectedDirections.slice(0, 3);
  const positionOffset = 3 - Math.max(1, visibleDirections.length);
  const options = Object.entries(labels) as Array<[OnboardingGoalDirection, string]>;

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  const openEditor = () => {
    setDraftDirections(selectedDirections);
    setIsOpen(true);
  };

  const toggleDirection = (direction: OnboardingGoalDirection) => {
    setDraftDirections((current) =>
      current.includes(direction)
        ? current.filter((item) => item !== direction)
        : current.length < 3
          ? [...current, direction]
          : current,
    );
  };

  return (
    <>
      <article className="group relative h-full min-h-36 overflow-hidden bg-white text-[#123743]">
        <div className="h-full p-6 transition duration-300 group-hover:scale-[.992] group-hover:blur-[2.5px] group-focus-within:scale-[.992] group-focus-within:blur-[2.5px]">
          <div className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#567987]">
            Direction
          </div>

          <div className="absolute inset-x-6 bottom-5 top-14">
            {visibleDirections.length > 0 ? (
              <>
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100"
                >
                  <path
                    d="M2 88H32V59H66V29H98"
                    stroke="#b9dbe7"
                    strokeLinecap="square"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {visibleDirections.map((direction, index) => {
                  const positionIndex = index + positionOffset;
                  const color = stepColors[positionIndex];

                  return (
                    <div className={`absolute ${stepPositions[positionIndex]}`} key={direction}>
                      <div
                        className="font-serif text-[clamp(1.45rem,2.4vw,2.5rem)] leading-none tracking-[-.04em]"
                        style={{ color }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="mt-1 h-[3px] w-8" style={{ backgroundColor: color }} />
                      <div className="mt-2 line-clamp-3 text-[10px] font-semibold uppercase leading-[1.25] tracking-[.04em] text-[#123743]">
                        {labels[direction]}
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="flex h-full items-center text-xl font-semibold tracking-[-.03em]">
                Define your next direction
              </div>
            )}
          </div>
        </div>

        <button
          aria-label="Edit direction"
          className="absolute left-6 top-10 z-10 text-[9px] font-semibold uppercase tracking-[.15em] text-[#248ba3] opacity-0 transition hover:text-[#ff7a00] focus:opacity-100 focus:text-[#ff7a00] group-hover:opacity-100 group-focus-within:opacity-100"
          onClick={openEditor}
          type="button"
        >
          Edit
        </button>
      </article>

      {isOpen ? (
        <ModalPortal>
        <div
          aria-labelledby={dialogTitleId}
          aria-modal="true"
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#092736]/65 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setIsOpen(false);
          }}
          role="dialog"
        >
          <div className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <header className="flex items-start justify-between gap-6 border-b border-[#dce9ed] px-7 py-6">
              <div>
                <h2 className="text-3xl font-semibold tracking-[-.045em] text-[#123743]" id={dialogTitleId}>
                  Direction
                </h2>
                <p className="mt-1 text-sm text-[#64748b]">
                  Choose up to three directions. Their order defines the staircase.
                </p>
              </div>
              <button className="text-sm font-semibold text-[#64748b] transition hover:text-[#ff7a00]" onClick={() => setIsOpen(false)} type="button">
                Close
              </button>
            </header>

            <div className="grid min-h-0 flex-1 gap-3 overflow-y-auto px-7 py-6 sm:grid-cols-2">
              {options.map(([direction, label], index) => {
                const checked = draftDirections.includes(direction);
                const disabled = !checked && draftDirections.length >= 3;
                const order = draftDirections.indexOf(direction);

                return (
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition ${
                      checked ? "bg-[#eaf7fa] text-[#123743]" : "bg-[#f5f8f9] text-[#526b7f]"
                    } ${disabled ? "cursor-not-allowed opacity-45" : "hover:bg-[#eaf7fa]"}`}
                    key={direction}
                  >
                    <input
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggleDirection(direction)}
                      type="checkbox"
                    />
                    <span className="min-w-0 flex-1 text-sm font-semibold">{label}</span>
                    <span className="text-[10px] font-semibold tabular-nums tracking-[.12em] text-[#248ba3]">
                      {order >= 0 ? String(order + 1).padStart(2, "0") : String(index + 1).padStart(2, "0")}
                    </span>
                  </label>
                );
              })}
            </div>

            <footer className="flex justify-end gap-3 border-t border-[#dce9ed] px-7 py-5">
              <button className="px-4 py-3 text-sm font-semibold text-[#64748b] transition hover:text-[#ff7a00]" onClick={() => setIsOpen(false)} type="button">
                Cancel
              </button>
              <button
                className="rounded-xl bg-[#123f4d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#ff7a00]"
                onClick={() => {
                  onSave(draftDirections);
                  setIsOpen(false);
                }}
                type="button"
              >
                Save direction
              </button>
            </footer>
          </div>
        </div>
        </ModalPortal>
      ) : null}
    </>
  );
}
