export default function D1GlobalHeaderFrame() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold tracking-tight">
          <span className="text-cyan-500">O</span>
          <span className="text-blue-600">Sai</span>
        </div>
        <div className="h-6 w-px bg-slate-200" />
        <div className="text-sm font-semibold text-slate-800">Career Graph</div>
      </div>

      <div className="w-[420px] rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-400">
        Search skills, keywords, companies...
      </div>

      <div className="flex items-center gap-3 text-sm text-slate-600">
        <button className="rounded-full border border-slate-200 px-4 py-2 font-medium">
          AI Coach
        </button>
        <div className="h-9 w-9 rounded-full bg-slate-200" />
      </div>
    </header>
  );
}