"use client";

import { useEffect, useId, useState } from "react";
import ModalPortal from "@/core/ui/ModalPortal";

type HighlightsTileProps = {
  highlights: string[];
  onSave: (highlights: string[]) => void;
  placement?: "grid" | "profileHeader";
};

export default function HighlightsTile({
  highlights,
  onSave,
  placement = "grid",
}: HighlightsTileProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [draftHighlights, setDraftHighlights] = useState<string[]>([]);
  const dialogTitleId = useId();
  const displayHighlights = highlights.length > 0 ? highlights : ["Add a signature achievement"];
  const safeActiveIndex = activeIndex % displayHighlights.length;
  const isProfileHeader = placement === "profileHeader";

  useEffect(() => {
    if (displayHighlights.length <= 1) return;

    let fadeTimer: ReturnType<typeof setTimeout> | undefined;
    const interval = window.setInterval(() => {
      setIsVisible(false);
      fadeTimer = setTimeout(() => {
        setActiveIndex((current) => (current + 1) % displayHighlights.length);
        setIsVisible(true);
      }, 600);
    }, 15_000);

    return () => {
      window.clearInterval(interval);
      if (fadeTimer) clearTimeout(fadeTimer);
    };
  }, [displayHighlights.length]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  const openEditor = () => {
    setDraftHighlights(highlights.length > 0 ? highlights : [""]);
    setIsOpen(true);
  };

  const saveHighlights = () => {
    onSave(
      draftHighlights
        .map((highlight) => highlight.trim())
        .filter(Boolean)
        .filter((highlight, index, values) => values.indexOf(highlight) === index),
    );
    setIsOpen(false);
  };

  return (
    <>
      <article
        data-testid={`highlights-tile-${placement}`}
        className={`group relative min-h-0 overflow-hidden bg-white text-[#123743] ${
          isProfileHeader
            ? "h-[3.6rem] w-[90%] sm:h-16"
            : "h-72 max-h-72"
        }`}
      >
        <div
          className={`h-full min-h-0 overflow-hidden transition duration-500 group-hover:scale-[.992] group-hover:blur-[2.5px] group-focus-within:scale-[.992] group-focus-within:blur-[2.5px] ${
            isProfileHeader
              ? "flex items-start px-0 pb-2 pt-2"
              : "p-6"
          }`}
        >
          {!isProfileHeader ? (
            <div className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#567987]">
              Highlights
            </div>
          ) : null}

          <div className="w-full">
            <div
              aria-live="polite"
              className={`${isProfileHeader ? "min-w-0 text-left" : "mt-8 max-h-[10.75rem]"} overflow-hidden transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
            >
              <blockquote className={`font-sans font-semibold leading-[1.03] tracking-[-.035em] text-[#123743] ${isProfileHeader ? "line-clamp-2 text-[clamp(1.05rem,1.6vw,1.5rem)]" : "line-clamp-5 text-[clamp(1.25rem,1.7vw,1.9rem)]"}`}>
                {displayHighlights[safeActiveIndex]}
              </blockquote>
            </div>
          </div>
        </div>

        <button
          className={`absolute z-10 text-[9px] font-semibold uppercase tracking-[.15em] text-[#248ba3] opacity-0 transition hover:text-[#ff7a00] focus:opacity-100 focus:text-[#ff7a00] group-hover:opacity-100 group-focus-within:opacity-100 ${
            isProfileHeader ? "left-0 top-2" : "left-6 top-10"
          }`}
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
                  Highlights
                </h2>
                <p className="mt-1 text-sm text-[#64748b]">
                  Curate the achievements that best express your impact.
                </p>
              </div>
              <button
                className="text-sm font-semibold text-[#64748b] transition hover:text-[#ff7a00]"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Close
              </button>
            </header>

            <ol className="min-h-0 flex-1 space-y-3 overflow-y-auto px-7 py-6">
              {draftHighlights.map((highlight, index) => (
                <li className="grid grid-cols-[2.5rem_1fr_auto] items-start gap-3" key={`highlight-${index}`}>
                  <span className="pt-4 text-right text-xs font-semibold tabular-nums tracking-[.12em] text-[#1689a3]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <textarea
                    autoFocus={index === 0}
                    className="min-h-24 resize-y rounded-xl border border-[#c6dce2] px-4 py-3 text-sm leading-6 text-[#123743] outline-none transition focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                    onChange={(event) =>
                      setDraftHighlights((current) =>
                        current.map((item, itemIndex) => itemIndex === index ? event.target.value : item),
                      )
                    }
                    placeholder="Describe a signature achievement"
                    value={highlight}
                  />
                  <button
                    className="px-2 py-4 text-xs font-semibold text-[#78909a] transition hover:text-[#d65400]"
                    onClick={() => setDraftHighlights((current) => current.filter((_, itemIndex) => itemIndex !== index))}
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
                onClick={() => setDraftHighlights((current) => [...current, ""])}
                type="button"
              >
                Add highlight
              </button>
              <div className="flex gap-3">
                <button className="px-4 py-3 text-sm font-semibold text-[#64748b] transition hover:text-[#ff7a00]" onClick={() => setIsOpen(false)} type="button">
                  Cancel
                </button>
                <button className="rounded-xl bg-[#123f4d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#ff7a00]" onClick={saveHighlights} type="button">
                  Save highlights
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
