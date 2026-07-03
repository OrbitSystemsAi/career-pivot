const strengths = [
  "Finance leadership",
  "Data analytics",
  "Executive reporting",
  "Transformation planning",
];

export default function D5BottomLeftPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Strengths
      </div>

      <div className="flex flex-col gap-2">
        {strengths.map((strength) => (
          <button
            key={strength}
            className="flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
          >
            <span>{strength}</span>
            <span className="text-emerald-600">Strong</span>
          </button>
        ))}
      </div>
    </div>
  );
}