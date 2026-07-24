"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/core/auth/AuthProvider";
import { getActiveModule } from "@/core/moduleEngine/getActiveModule";
import { useOSState } from "@/core/state/OSStateProvider";

const motivationalPhrases = [
  "Build the next chapter",
  "Lead with clarity",
  "Turn momentum into motion",
  "Aim higher",
  "Make the signal visible",
  "Progress compounds",
  "Shape the opportunity",
  "Stay ready",
  "Translate experience into impact",
  "Keep moving forward",
  "Own your next move",
  "Make experience count",
  "Create what comes next",
  "Move with purpose",
  "Turn insight into action",
];

function getRandomPhraseIndex(currentIndex: number | null) {
  if (motivationalPhrases.length <= 1) {
    return 0;
  }

  let nextIndex = Math.floor(Math.random() * motivationalPhrases.length);

  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * motivationalPhrases.length);
  }

  return nextIndex;
}

export default function D1GlobalHeaderFrame() {
  const { deleteAccount, logout, session } = useAuth();
  const { activeModule, setActiveModule, setActiveView } = useOSState();
  const activeModuleConfig = getActiveModule(activeModule);
  const [highlightedPhraseIndex, setHighlightedPhraseIndex] = useState<
    number | null
  >(null);
  const [isDeleteArmed, setIsDeleteArmed] = useState(false);
  const initials = (session?.displayName ?? "OSai User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  useEffect(() => {
    const initialPhraseCycle = window.setTimeout(() => {
      setHighlightedPhraseIndex((currentIndex) =>
        getRandomPhraseIndex(currentIndex),
      );
    }, 0);

    const phraseCycle = window.setInterval(() => {
      setHighlightedPhraseIndex((currentIndex) =>
        getRandomPhraseIndex(currentIndex),
      );
    }, 15_000);

    return () => {
      window.clearTimeout(initialPhraseCycle);
      window.clearInterval(phraseCycle);
    };
  }, []);

  return (
    <header className="relative z-50 grid h-16 grid-cols-[12rem_minmax(0,1fr)_16rem] items-center overflow-visible bg-white text-[#123743]">
      <div className="flex h-full min-w-0 items-center px-2">
        <div className="w-full whitespace-nowrap text-[2rem] font-semibold leading-none tracking-[-0.045em] text-[#123743]">
          Career Pivot
        </div>
      </div>

      <div
        aria-hidden="true"
        className="relative hidden h-full min-w-0 grid-cols-5 grid-rows-[repeat(3,max-content)] content-center gap-x-[clamp(0.25rem,0.6vw,0.75rem)] gap-y-0 overflow-hidden bg-white px-[clamp(0.5rem,1vw,1.25rem)] py-2 text-[clamp(7px,0.72vw,16px)] font-bold uppercase leading-none tracking-[0.06em] text-[#49646c] md:grid"
      >
        {motivationalPhrases.map((phrase, index) => (
          <span
            className={`whitespace-nowrap transition-colors duration-700 ${
              index % 5 === 0
                ? "text-left"
                : index % 5 === 4
                  ? "text-right"
                  : "text-center"
            } ${
              highlightedPhraseIndex === index
                ? "text-orange-600"
                : "text-[#49646c]/25"
            }`}
            data-highlighted={highlightedPhraseIndex === index}
            key={phrase}
          >
            {phrase}
          </span>
        ))}
      </div>

      <div className="flex h-full min-w-0 items-center gap-2 px-3">
        <div className="relative flex min-w-0 flex-1 items-center overflow-hidden whitespace-nowrap rounded-md border border-[#b7cbd0] bg-[#f6fafb] px-3 py-2 text-xs text-[#526b74] shadow-inner">
          Search {activeModuleConfig.name.toLowerCase()}...
        </div>

        <details
          className="group relative"
          onToggle={(event) => {
            if (!event.currentTarget.open) {
              setIsDeleteArmed(false);
            }
          }}
        >
          <summary
            aria-label="Open account menu"
            className="relative flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-[#8eabb2] bg-[#2b6874] text-xs text-white transition marker:hidden hover:border-orange-400 hover:bg-[#205763] focus:outline-none focus:ring-2 focus:ring-orange-300 sm:h-10 sm:w-10"
          >
            {initials}
          </summary>
          <div className="absolute right-0 top-12 w-48 overflow-hidden rounded-xl border border-[#aac3c9] bg-white py-1 text-sm text-[#173d48] shadow-2xl">
            <div className="border-b border-[#d8e4e7] px-4 py-3">
              <p className="truncate font-semibold">{session?.displayName}</p>
              <p className="truncate text-xs text-[#6b7f88]">{session?.email}</p>
            </div>
            <button
              className="block w-full px-4 py-3 text-left transition hover:bg-[#e8f5f8]"
              onClick={() => {
                setActiveModule("home");
                setActiveView("profile");
              }}
              type="button"
            >
              View profile
            </button>
            {isDeleteArmed ? (
              <div className="border-t border-[#f0c7ad] bg-[#fff7f1] px-4 py-3">
                <p className="text-xs font-semibold text-[#8f3d08]">
                  Delete all Career Pivot data?
                </p>
                <p className="mt-1 text-xs leading-5 text-[#8a6550]">
                  This cannot be undone.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    className="flex-1 rounded-lg bg-[#b64e09] px-2 py-2 text-xs font-semibold text-white transition hover:bg-[#963d05]"
                    onClick={deleteAccount}
                    type="button"
                  >
                    Confirm delete
                  </button>
                  <button
                    className="rounded-lg border border-[#c7d5d8] bg-white px-3 py-2 text-xs font-semibold text-[#405d65] transition hover:bg-[#eef6f7]"
                    onClick={() => setIsDeleteArmed(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  className="block w-full px-4 py-3 text-left transition hover:bg-[#e8f5f8]"
                  onClick={logout}
                  type="button"
                >
                  Log out
                </button>
                <button
                  className="block w-full border-t border-[#e3eaec] px-4 py-3 text-left font-semibold text-[#b64e09] transition hover:bg-[#fff1e6]"
                  onClick={() => setIsDeleteArmed(true)}
                  type="button"
                >
                  Delete account
                </button>
              </>
            )}
          </div>
        </details>
      </div>
    </header>
  );
}
