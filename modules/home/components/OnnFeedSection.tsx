"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { OnnFeedSignal } from "../lib/onnFeedSignals";
import type { CareerPivotFeed, CareerPivotFeedItem } from "../server/onnFeedAdapter";

type OnnFeedSectionProps = {
  classifications: OnnFeedSignal[];
  topics: OnnFeedSignal[];
};

function sendFeedback(item: CareerPivotFeedItem, interaction: "shown" | "opened" | "saved" | "dismissed" | "useful" | "not_relevant") {
  return fetch("/api/onn/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemType: item.origin, itemId: item.id, interaction }),
    keepalive: true,
  }).catch(() => undefined);
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Recently" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

export default function OnnFeedSection({ classifications, topics }: OnnFeedSectionProps) {
  const [feed, setFeed] = useState<CareerPivotFeed | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());
  const [saved, setSaved] = useState<Set<string>>(() => new Set());
  const shown = useRef(new Set<string>());
  const requestKey = useMemo(() => JSON.stringify({ classifications, topics }), [classifications, topics]);
  const error = errorKey === requestKey;

  useEffect(() => {
    let active = true;
    fetch("/api/onn/feed", { method: "POST", headers: { "Content-Type": "application/json" }, body: requestKey, cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({})) as { feed?: CareerPivotFeed };
        if (!response.ok || !payload.feed) throw new Error("FEED_UNAVAILABLE");
        if (active) { setFeed(payload.feed); setErrorKey(null); }
      })
      .catch(() => { if (active) setErrorKey(requestKey); });
    return () => { active = false; };
  }, [requestKey]);

  useEffect(() => {
    feed?.items.forEach((item) => {
      if (shown.current.has(item.id)) return;
      shown.current.add(item.id);
      void sendFeedback(item, "shown");
    });
  }, [feed]);

  const items = feed?.items.filter((item) => !dismissed.has(item.id)) ?? [];

  return (
    <section aria-busy={!feed && !error} aria-labelledby="onn-edition-heading" className="mt-7 border-y border-[#173a46] py-6" data-testid="onn-feed-section">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#d86400]">Orbit News Network</p>
          <h2 className="mt-1 font-serif text-3xl text-[#101f24]" id="onn-edition-heading">Signals for your next chapter</h2>
          <p className="mt-1 text-xs text-[#6a7c82]">Selected from your career direction and interests, with the original source preserved.</p>
        </div>
        {feed?.stale ? <p className="rounded-full bg-[#fff4e8] px-3 py-1 text-[10px] font-semibold text-[#9a4b00]">Last known edition</p> : feed?.partial ? <p className="rounded-full bg-[#eef7f8] px-3 py-1 text-[10px] font-semibold text-[#116a7e]">Partial edition</p> : null}
      </div>

      {!feed && !error ? <p className="mt-5 text-sm text-[#60767d]">Preparing your edition…</p> : null}
      {error ? <div className="mt-5 border-l-2 border-[#f28c28] pl-4"><p className="text-sm font-semibold">Your personalized edition is temporarily unavailable.</p><p className="mt-1 text-xs text-[#6a7c82]">The rest of Career Pivot remains available. Try again on your next visit.</p></div> : null}
      {feed && items.length === 0 ? <p className="mt-5 text-sm text-[#60767d]">No current stories meet your preferences. ONN will not fill this space with unrelated content.</p> : null}

      {items.length > 0 ? (
        <div className="mt-5 grid gap-px bg-[#cfdadc] md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <article className="flex min-h-64 flex-col bg-white p-5" key={`${item.origin}:${item.id}`}>
              <div className="flex items-center justify-between gap-3 text-[9px] font-bold uppercase tracking-[0.13em] text-[#708087]">
                <span>{item.origin === "external_news" ? "External news" : "Orbit publication"}</span>
                <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
              </div>
              <h3 className="mt-3 font-serif text-2xl leading-[1.04] text-[#101f24]">{item.title}</h3>
              {item.summary ? <p className="mt-3 line-clamp-4 text-xs leading-5 text-[#5e7278]">{item.summary}</p> : null}
              <p className="mt-auto pt-5 text-[10px] font-semibold text-[#526b72]">Source: {item.provenance.sourceName}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold">
                {item.url ? <a className="text-[#116a7e] underline decoration-[#f28c28] underline-offset-4" href={item.url} onClick={() => void sendFeedback(item, "opened")} rel="noopener noreferrer" target="_blank">Read original ↗</a> : null}
                <button aria-pressed={saved.has(item.id)} onClick={() => { setSaved((current) => new Set(current).add(item.id)); void sendFeedback(item, "saved"); }} type="button">{saved.has(item.id) ? "Saved" : "Save"}</button>
                <button onClick={() => void sendFeedback(item, "useful")} type="button">Useful</button>
                <button onClick={() => { setDismissed((current) => new Set(current).add(item.id)); void sendFeedback(item, "not_relevant"); }} type="button">Not relevant</button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
