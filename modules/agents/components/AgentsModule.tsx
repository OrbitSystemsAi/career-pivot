"use client";

import { useState } from "react";
import { useUser } from "@/core/user/UserProvider";
import { agentCatalog } from "@/modules/agents/data/agentCatalog";
import { getAgentIntelligence } from "@/modules/agents/lib/agentIntelligence";

export default function AgentsModule() {
  const {
    user,
    recruitAgent,
    updateAgentStatus,
    removeAgent,
  } = useUser();
  const agents = getAgentIntelligence(user);
  const [showCatalog, setShowCatalog] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  if (agents.recruitedAgents.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white p-8">
        <section className="flex min-h-[360px] w-full max-w-4xl flex-col items-center justify-center rounded-3xl border border-[#c8dfe9] bg-[linear-gradient(145deg,#f8fcfe,#e3f3f9)] px-8 py-9 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#173a46] text-xl text-white">
            ✦
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[#102f39]">
            Recruit an Agent
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Build a coordinated team for repetitive career work. Agents act on
            your approved goals, opportunities, documents, and relationships.
          </p>

          {!showCatalog ? (
            <>
              <div className="mt-7 grid w-full max-w-2xl gap-3 text-left sm:grid-cols-2">
                {agentCatalog.slice(0, 2).map((agent) => (
                  <article
                    key={agent.role}
                    className="rounded-2xl border border-[#afd2e7] bg-white/80 p-4"
                  >
                    <div className="text-sm font-semibold text-[#173a46]">
                      {agent.name}
                    </div>
                    <div className="mt-1 text-xs leading-5 text-slate-500">
                      {agent.description}
                    </div>
                    {agent.handoff ? (
                      <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#2b6874]">
                        {agent.handoff}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowCatalog(true)}
                className="mt-6 rounded-xl bg-[#164858] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#f28c28]"
              >
                Recruit an Agent
              </button>
            </>
          ) : (
            <div className="mt-7 w-full">
              <div className="grid gap-3 text-left sm:grid-cols-2">
                {agentCatalog.map((agent) => (
                  <article
                    key={agent.role}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-[#afd2e7] bg-white/85 p-4"
                  >
                    <div>
                      <div className="text-sm font-semibold text-[#173a46]">
                        {agent.name}
                      </div>
                      <div className="mt-1 text-xs leading-5 text-slate-500">
                        {agent.description}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => recruitAgent(agent.role, agent.name)}
                      className="shrink-0 rounded-lg bg-[#164858] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#f28c28]"
                    >
                      Recruit
                    </button>
                  </article>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowCatalog(false)}
                className="mt-5 text-xs font-semibold text-[#2b6874] underline decoration-[#f28c28] decoration-2 underline-offset-4"
              >
                Back
              </button>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-white p-6 text-[#173a46]">
      <header className="flex flex-col justify-between gap-5 rounded-3xl bg-[linear-gradient(135deg,#102f39,#2b6874)] p-7 text-white sm:flex-row sm:items-end">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b9d0d5]">
            Your agent team
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            {agents.activeAgents} active {agents.activeAgents === 1 ? "agent" : "agents"}
          </h2>
          <p className="mt-2 text-sm text-[#d3e1e4]">
            Task and outcome metrics remain zero until an agent completes real work.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCatalog((current) => !current)}
          className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#f28c28]"
        >
          {showCatalog ? "Close catalog" : "Recruit another agent"}
        </button>
      </header>

      {showCatalog ? (
        <section className="mt-5 grid gap-4 sm:grid-cols-2">
          {agentCatalog.map((definition) => {
            const recruited = agents.recruitedAgents.some(
              (agent) => agent.role === definition.role
            );

            return (
              <article
                key={definition.role}
                className="flex items-start justify-between gap-4 rounded-2xl border border-[#afd2e7] bg-[#eef8fd] p-5"
              >
                <div>
                  <h3 className="text-lg font-semibold">{definition.name}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    {definition.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => recruitAgent(definition.role, definition.name)}
                  disabled={recruited}
                  className="shrink-0 rounded-lg bg-[#164858] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#f28c28] disabled:cursor-default disabled:bg-slate-300"
                >
                  {recruited ? "Recruited" : "Recruit"}
                </button>
              </article>
            );
          })}
        </section>
      ) : (
      <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {agents.recruitedAgents.map((agent) => {
          const definition = agentCatalog.find((item) => item.role === agent.role);
          const confirmingRemove = confirmRemoveId === agent.id;

          return (
            <article
              key={agent.id}
              className="rounded-2xl border border-[#afd2e7] bg-[#eef8fd] p-5"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2b6874]">
                {agent.status}
              </div>
              <h3 className="mt-3 text-lg font-semibold">{agent.name}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                {definition?.description}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  aria-label={`${agent.status === "active" ? "Pause" : "Resume"} ${agent.name}`}
                  onClick={() =>
                    updateAgentStatus(
                      agent.id,
                      agent.status === "active" ? "paused" : "active"
                    )
                  }
                  className="rounded-lg bg-[#164858] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#f28c28]"
                >
                  {agent.status === "active" ? "Pause" : "Resume"}
                </button>

                {!confirmingRemove ? (
                  <button
                    type="button"
                    aria-label={`Remove ${agent.name}`}
                    onClick={() => setConfirmRemoveId(agent.id)}
                    className="rounded-lg border border-[#c8d8dc] bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    Remove
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      aria-label={`Confirm remove ${agent.name}`}
                      onClick={() => {
                        removeAgent(agent.id);
                        setConfirmRemoveId(null);
                      }}
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                    >
                      Confirm Remove
                    </button>
                    <button
                      type="button"
                      aria-label={`Cancel removing ${agent.name}`}
                      onClick={() => setConfirmRemoveId(null)}
                      className="px-2 py-2 text-xs font-semibold text-slate-500 hover:text-[#173a46]"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </section>
      )}
    </div>
  );
}
