"use client";

import Image from "next/image";

type LandingScreenProps = {
  onCreateAccount: () => void;
  onLogin: () => void;
};

export default function LandingScreen({
  onCreateAccount,
  onLogin,
}: LandingScreenProps) {
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
            <Image
              alt="One professional progressing through five distinct ages and career chapters"
              className="object-contain object-bottom"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              src="/career-pivot-life-stages-v2.png"
            />
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
