"use client";

import Link from "next/link";
import { useUser } from "@/core/user/UserProvider";
import { getNetworkIntelligence } from "@/modules/network/lib/networkIntelligence";

export default function NetworkModule() {
  const { user } = useUser();
  const network = getNetworkIntelligence(user);

  if (!network.hasConnectedSource) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white p-8">
        <section className="flex min-h-[325px] w-full max-w-3xl flex-col items-center justify-center rounded-3xl border border-[#c8dfe9] bg-[linear-gradient(145deg,#f8fcfe,#e3f3f9)] px-10 py-10 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#173a46] text-xl text-white">
            ◎
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[#102f39]">
            Connect your network to begin
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Network insights will appear only after you connect an approved
            source or establish relationships inside Career Pivot.
          </p>

          <div className="mt-7 grid w-full max-w-xl gap-3 text-left sm:grid-cols-2">
            <Link
              href="/network/linkedin-import"
              aria-label="Learn how to import your LinkedIn connections"
              className="group rounded-2xl border border-[#afd2e7] bg-white/80 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#2b6874] hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168391] focus-visible:ring-offset-2"
            >
              <div className="text-sm font-semibold text-[#173a46]">LinkedIn</div>
              <div className="mt-1 text-xs leading-5 text-slate-500">
                Import a copy of your LinkedIn connections to begin building
                your possible network.
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#2b6874]">
                <span>View import guide</span>
                <span
                  aria-hidden="true"
                  className="text-base transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </Link>

            <article className="rounded-2xl border border-[#9fc1c8] bg-white/80 p-4">
              <div className="text-sm font-semibold text-[#173a46]">Career Pivot Network</div>
              <div className="mt-1 text-xs leading-5 text-slate-500">
                Relationships created within this site will build your private
                network map over time.
              </div>
              <div className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#2b6874]">
                No connections yet
              </div>
            </article>
          </div>
        </section>
      </div>
    );
  }

  if (!network.hasConnections) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white p-8 text-center">
        <div>
          <h2 className="text-2xl font-semibold text-[#102f39]">
            Your source is connected
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            No network relationships are available yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="text-5xl font-bold text-[#126174]">
          {network.score}%
        </div>
        <div className="mt-3 text-sm font-medium text-slate-700">
          Network Alignment
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Based on {network.connections.length} connected relationships
        </div>
      </div>
    </div>
  );
}
