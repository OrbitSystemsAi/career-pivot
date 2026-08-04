"use client";

import Image from "next/image";
import { useState } from "react";
import { useOSState } from "@/core/state/OSStateProvider";

type HomeMagazineProps = {
  currentTitle?: string;
  highlights: string[];
  proofCount: number;
  readiness?: number;
  savedCount: number;
};

const signals = [
  { section: "Work & the future", title: "AI fluency is becoming the new literacy" },
  { section: "Leadership", title: "Clarity is the advantage in uncertain times" },
  { section: "Career strategy", title: "Build a portfolio career playbook" },
];

const subscriptions = [
  { category: "Network", name: "Maya Chen", detail: "People systems · Leadership" },
  { category: "Career", name: "Intelligent work", detail: "AI fluency · Strategy" },
  { category: "Interests", name: "Human potential", detail: "Design · Psychology" },
  { category: "Groups", name: "Design Leaders", detail: "Peer conversations" },
];

const magazineLayoutClasses = {
  "career-editorial": "xl:grid-cols-[minmax(0,1fr)_15rem]",
  "social-journal": "xl:grid-cols-[minmax(0,1fr)_18rem]",
  "left-rail": "xl:grid-cols-[15rem_minmax(0,1fr)] [&>aside]:xl:order-first",
  "featured-story": "xl:grid-cols-[minmax(0,1fr)_13rem]",
  "post-stream": "xl:grid-cols-[minmax(0,1fr)_18rem]",
  milestone: "xl:grid-cols-[15rem_minmax(0,1fr)] [&>aside]:xl:order-first",
  portfolio: "xl:grid-cols-[13rem_minmax(0,1fr)] [&>aside]:xl:order-first",
  community: "xl:grid-cols-[minmax(0,1fr)_17rem]",
  "career-chronicle": "xl:grid-cols-[14rem_minmax(0,1fr)] [&>aside]:xl:order-first",
  "goals-growth": "xl:grid-cols-[minmax(0,1fr)_16rem]",
  "profile-magazine": "xl:grid-cols-[17rem_minmax(0,1fr)] [&>aside]:xl:order-first",
  "network-desk": "xl:grid-cols-[18rem_minmax(0,1fr)] [&>aside]:xl:order-first",
} as const;

export default function HomeMagazine({
  currentTitle,
  highlights,
  proofCount,
  readiness,
  savedCount,
}: HomeMagazineProps) {
  const {
    publisherLayoutId,
    readingLayoutId,
    readingLayoutPreference,
    setActiveView,
  } = useOSState();
  const [followed, setFollowed] = useState(() => new Set(["Maya Chen", "Design Leaders"]));
  const effectiveLayoutId = readingLayoutPreference === "personal" ? readingLayoutId : publisherLayoutId;

  function toggleSubscription(nameToToggle: string) {
    setFollowed((current) => {
      const next = new Set(current);
      if (next.has(nameToToggle)) next.delete(nameToToggle);
      else next.add(nameToToggle);
      return next;
    });
  }

  return (
    <div className="min-h-full bg-white text-[#173a46]" data-testid="home-magazine">
      <div className="min-h-full">
        <main className="min-w-0 px-5 pb-12 pt-6 sm:px-7">
          <header className="grid items-end gap-4 border-b border-[#173a46] pb-4 sm:grid-cols-[1fr_auto_1fr]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em]">2026 Edition - Aug 04</p>
            <h1 className="font-serif text-4xl leading-none tracking-[-0.04em] text-[#101f24] sm:text-5xl">Today&apos;s Pulse</h1>
            <p className="justify-self-start text-xs font-semibold text-[#168391] sm:justify-self-end">OSai News Network</p>
          </header>

          <div className="flex justify-end border-b border-[#d5dfe1] py-2">
            <button
              className="border-b-2 border-[#f28c28] px-2 py-1 text-[10px] font-semibold text-[#173a46]"
              onClick={() => setActiveView("post")}
              type="button"
            >
              Create Post
            </button>
          </div>

          <div className={`mt-5 grid gap-7 ${magazineLayoutClasses[effectiveLayoutId]}`} data-magazine-layout={effectiveLayoutId}>
            <div className="min-w-0">
              <article className="relative min-h-[22rem] overflow-hidden bg-[#173a46] text-white">
                <Image alt="A career evolving through distinct stages of work" className="object-cover object-center opacity-75" fill priority sizes="(max-width: 1280px) 100vw, 760px" src="/career-pivot-life-stages-v2.png" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,32,39,.88),rgba(8,32,39,.12)_70%)]" />
                <div className="absolute inset-x-0 bottom-0 max-w-2xl p-6 sm:p-8">
                  <h2 className="max-w-xl font-serif text-4xl leading-[0.94] tracking-[-0.035em] sm:text-6xl">The work becoming visible</h2>
                  <p className="mt-4 max-w-lg text-sm leading-6 text-white/90">How clarity, intelligence, and human judgment are shaping the next era of impact.</p>
                  <div className="mt-5 flex gap-5 text-xs font-semibold"><button type="button">Open story →</button><button type="button">Save for later</button></div>
                </div>
              </article>

              <section className="grid border-b border-[#cfdadc] py-6 md:grid-cols-[0.9fr_1.35fr]">
                <div className="pr-6">
                  <h2 className="font-serif text-3xl leading-[1.02] tracking-[-0.025em] text-[#101f24]">A career edition shaped around you</h2>
                  <p className="mt-4 text-xs leading-5 text-[#5e7278]">Your goals, network, interests, and communities become a considered edition—not a feed competing for attention.</p>
                  <p className="mt-4 font-serif text-xl italic text-[#173a46]">Read what resonates. Skip what doesn’t.</p>
                </div>
                <article className="mt-6 grid gap-4 border-t border-[#cfdadc] pt-5 md:mt-0 md:grid-cols-[0.9fr_1fr] md:border-l md:border-t-0 md:pl-6 md:pt-0">
                  <div className="relative min-h-48 overflow-hidden bg-[#edf2f2]">
                    <Image alt="A professional progressing through her career" className="object-cover object-[54%_center]" fill sizes="360px" src="/osai-career-path-hero.png" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#6b7f85]">Inside your network</p>
                    <h3 className="mt-2 font-serif text-2xl leading-[1.02] text-[#101f24]">Maya Chen on building systems that unlock human potential</h3>
                    <p className="mt-3 text-xs leading-5 text-[#5e7278]">A quiet conversation about teams that grow people, not just output.</p>
                    <button className="mt-4 text-xs font-semibold" type="button">Open story →</button>
                  </div>
                </article>
              </section>

              <section className="grid gap-6 border-b border-[#cfdadc] py-6 md:grid-cols-2">
                <article className="md:border-r md:border-[#cfdadc] md:pr-6">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#6b7f85]">The next chapter of intelligent work</p>
                  <h3 className="mt-2 font-serif text-3xl leading-none text-[#101f24]">From automation to augmentation</h3>
                  <p className="mt-3 text-xs leading-5 text-[#5e7278]">The frontier is not replacing people with machines. It is pairing judgment with intelligence.</p>
                  <button className="mt-4 text-xs font-semibold" type="button">Open essay →</button>
                </article>
                <article className="grid grid-cols-[1fr_1.1fr] gap-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#6b7f85]">Community dispatch</p>
                    <h3 className="mt-2 font-serif text-2xl leading-none text-[#101f24]">Design Leaders Community</h3>
                    <p className="mt-3 text-xs leading-5 text-[#5e7278]">Highlights from a conversation on ethical AI and navigating change.</p>
                  </div>
                  <div className="relative min-h-40 overflow-hidden bg-[#edf2f2]"><Image alt="Leaders gathering for a community conversation" className="object-cover object-[20%_center]" fill sizes="280px" src="/career-pivot-messy-paths.png" /></div>
                </article>
              </section>
            </div>

            <aside>
              <h2 className="border-b border-[#173a46] pb-3 text-[10px] font-bold uppercase tracking-[0.16em]">Signals worth following</h2>
              <div>
                {signals.map((signal, index) => (
                  <article className="border-b border-[#cfdadc] py-4" key={signal.title}>
                    <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#708087]">{signal.section}</p>
                    <h3 className="mt-2 font-serif text-xl leading-[1.05] text-[#101f24]">{signal.title}</h3>
                    <p className="mt-2 text-[10px] text-[#708087]">{index === 0 ? "4 min read" : index === 1 ? "Saved by your network" : "For your career"}</p>
                  </article>
                ))}
              </div>
              <blockquote className="mt-7 border-t border-[#cfdadc] pt-6">
                <span className="font-serif text-5xl leading-none text-[#f28c28]">“</span>
                <p className="font-serif text-2xl leading-[1.12] text-[#101f24]">The most valuable skill is the ability to learn, unlearn, and choose again.</p>
              </blockquote>
              <div className="mt-7 border-t border-[#cfdadc] pt-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em]">Your highlights</p>
                <dl className="mt-3 grid grid-cols-3 gap-2">
                  <div><dt className="text-[9px] text-[#708087]">Readiness</dt><dd className="mt-1 font-serif text-2xl">{readiness ?? "—"}%</dd></div>
                  <div><dt className="text-[9px] text-[#708087]">Proof</dt><dd className="mt-1 font-serif text-2xl">{proofCount}</dd></div>
                  <div><dt className="text-[9px] text-[#708087]">Saved</dt><dd className="mt-1 font-serif text-2xl">{savedCount}</dd></div>
                </dl>
                {highlights[0] ? <p className="mt-4 border-l-2 border-[#f28c28] pl-3 text-xs leading-5">{highlights[0]}</p> : null}
                {currentTitle ? <p className="mt-4 text-[10px] uppercase tracking-[0.12em] text-[#708087]">Current chapter · {currentTitle}</p> : null}
              </div>
            </aside>
          </div>

          <section className="mt-7 border-y border-[#173a46] py-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div><h2 className="font-serif text-3xl text-[#101f24]">Your subscription shelf</h2><p className="mt-1 text-xs text-[#6a7c82]">Curate the people, themes, and communities that shape your edition.</p></div>
              <button className="text-xs font-semibold text-[#168391]" type="button">Manage subscriptions →</button>
            </div>
            <div className="mt-5 grid gap-px bg-[#d5dfe1] sm:grid-cols-2 xl:grid-cols-4">
              {subscriptions.map((subscription) => {
                const isFollowed = followed.has(subscription.name);
                return (
                  <article className="flex items-center justify-between gap-3 bg-white px-4 py-4" key={subscription.name}>
                    <div><p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#d86400]">{subscription.category}</p><h3 className="mt-1 text-xs font-semibold">{subscription.name}</h3><p className="mt-1 text-[10px] text-[#708087]">{subscription.detail}</p></div>
                    <button aria-label={`${isFollowed ? "Unsubscribe from" : "Subscribe to"} ${subscription.name}`} aria-pressed={isFollowed} className="h-8 w-8 text-xl" onClick={() => toggleSubscription(subscription.name)} type="button">{isFollowed ? "✓" : "+"}</button>
                  </article>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
