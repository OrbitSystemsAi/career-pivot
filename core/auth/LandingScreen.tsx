"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type LandingScreenProps = {
  onCreateAccount: () => void;
  onLogin: () => void;
};

export default function LandingScreen({
  onCreateAccount,
  onLogin,
}: LandingScreenProps) {
  const [isChaotic, setIsChaotic] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const transitionTimer = window.setInterval(() => {
      setIsChaotic((currentState) => !currentState);
    }, 15_000);

    return () => window.clearInterval(transitionTimer);
  }, []);

  return (
    <main className="h-dvh overflow-hidden bg-white text-[#103744]">
      <section className="flex h-full min-h-0 flex-col bg-white">
        <header className="flex h-16 shrink-0 items-center justify-between px-6 sm:px-10 lg:h-[72px] lg:px-[clamp(3rem,6vw,7rem)]">
          <button
            className="text-xl font-bold tracking-[-0.04em] text-[#0b3948] sm:text-2xl"
            onClick={onCreateAccount}
            type="button"
          >
            Career Pivot
          </button>
          <button
            className="border-b-2 border-[#f28c28] pb-1 text-sm font-semibold text-[#133f4d] transition hover:text-[#f28c28] sm:text-base"
            onClick={onLogin}
            type="button"
          >
            Log in
          </button>
        </header>

        <div className="grid min-h-0 flex-1 items-center gap-4 px-6 pb-4 sm:px-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-8 lg:px-[clamp(3rem,6vw,7rem)] lg:pb-5">
          <div className="relative z-10 max-w-[560px]">
            <h1 className="text-[clamp(2.6rem,4.8vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.065em] text-[#0b3948]">
              <span className="block">What does</span>
              <span className="block">your career path</span>
              <span className="block">look like?</span>
            </h1>
            <p className="mt-[clamp(1rem,2.2vh,1.5rem)] max-w-[470px] text-[clamp(.95rem,1.25vw,1.2rem)] leading-[1.55] text-[#64778d]">
              Careers can be Messy
            </p>

            <div className="mt-[clamp(1rem,2.5vh,2rem)] h-0.5 w-12 bg-[#f28c28]" />
            <h2 className="mt-[clamp(1rem,2.5vh,1.75rem)] max-w-[410px] text-[clamp(1.35rem,2vw,2rem)] font-semibold leading-[1.12] tracking-[-0.025em] text-[#123f4d]">
              What do you really want
              <br />
              from your work?
            </h2>
            <p className="mt-3 max-w-[400px] text-[clamp(.9rem,1.1vw,1.1rem)] leading-[1.5] text-[#64778d]">
              Name the life, impact, and
              <br />
              work that feel worth building.
            </p>

            <div className="mt-[clamp(1rem,2.6vh,2rem)] flex items-start flex-col gap-5">
              <button
                className="min-w-[280px] rounded-xl bg-[#0c3c4b] px-8 py-4 text-base font-semibold text-white shadow-[0_10px_28px_rgba(12,60,75,.18)] transition hover:-translate-y-0.5 hover:bg-[#f28c28] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ffd7b2] sm:min-w-[320px] sm:text-lg"
                onClick={onCreateAccount}
                type="button"
              >
                Explore my path
              </button>
              <button
                className="border-b-2 border-[#f28c28] pb-1 text-sm font-semibold text-[#123f4d] transition hover:text-[#f28c28]"
                onClick={onLogin}
                type="button"
              >
                I already have an account
              </button>
            </div>
          </div>

          <div className="relative mx-auto h-[min(48vh,430px)] w-full max-w-[900px] self-end lg:h-[min(68vh,690px)] lg:self-center">
            <p
              aria-live="polite"
              className="absolute left-1/2 top-0 z-30 -translate-x-1/2 text-[clamp(2rem,4.2vw,4.8rem)] font-semibold leading-none tracking-[-0.055em] text-[#0b3948]"
            >
              {isChaotic ? "or This?" : "This?"}
            </p>

            <svg
              aria-hidden="true"
              className="absolute inset-x-0 top-[7%] z-20 h-[31%] w-full overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 900 210"
            >
              <defs>
                <marker
                  id="career-arrowhead"
                  markerHeight="8"
                  markerWidth="8"
                  orient="auto"
                  refX="7"
                  refY="4"
                  viewBox="0 0 8 8"
                >
                  <path d="M0 0 8 4 0 8Z" fill="currentColor" />
                </marker>
              </defs>

              <g
                className={`text-[#f28c28] transition-opacity duration-700 ${
                  isChaotic ? "opacity-0" : "opacity-100"
                }`}
              >
                <path
                  d="M18 184 C260 148 520 101 878 34"
                  fill="none"
                  markerEnd="url(#career-arrowhead)"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="4"
                  vectorEffect="non-scaling-stroke"
                />
              </g>

              <g
                className={`text-[#f28c28] transition-opacity duration-700 ${
                  isChaotic ? "opacity-100" : "opacity-0"
                }`}
              >
                <path
                  d="M18 182 C210 130 365 148 520 60 S735 82 876 28"
                  fill="none"
                  markerEnd="url(#career-arrowhead)"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d="M18 188 C170 80 300 88 415 50 C535 10 580 118 700 100 S815 82 875 55"
                  fill="none"
                  markerEnd="url(#career-arrowhead)"
                  stroke="currentColor"
                  strokeDasharray="10 9"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d="M18 176 C205 120 325 62 445 54 C560 47 625 96 690 132 C760 172 815 189 878 198"
                  fill="none"
                  markerEnd="url(#career-arrowhead)"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="4.5"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            </svg>

            <div className="absolute inset-x-0 bottom-0 top-[17%]">
              <Image
                alt="One professional progressing through five distinct ages and career chapters"
                className={`object-contain object-bottom transition-opacity duration-1000 ${
                  isChaotic ? "opacity-0" : "opacity-100"
                }`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                src="/career-pivot-life-stages-v2.png"
              />
              <Image
                alt="The same professional navigating five messy and unexpected career chapters"
                className={`object-contain object-bottom transition-opacity duration-1000 ${
                  isChaotic ? "opacity-100" : "opacity-0"
                }`}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                src="/career-pivot-messy-paths.png"
              />
            </div>
          </div>
        </div>

        <footer className="flex h-10 shrink-0 items-center gap-x-8 bg-[#0b3948] px-6 text-[10px] text-[#c9dce1] sm:px-10 sm:text-xs lg:px-[clamp(3rem,6vw,7rem)]">
          <span>Private by design. Your journey is yours.</span>
          <span aria-hidden="true" className="hidden h-4 w-px bg-[#79919a] sm:block" />
          <span className="hidden sm:inline">Built for clarity. Designed for progress.</span>
        </footer>
      </section>
    </main>
  );
}
