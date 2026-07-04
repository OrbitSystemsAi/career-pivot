export default function AgentContext() {
  const agents = [
    "Resume Optimizer",
    "Job Scanner",
    "Network Builder",
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Running Agents
      </div>

      {agents.map((agent) => (
        <button
          key={agent}
          className="rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
        >
          {agent}
        </button>
      ))}
    </div>
  );
}