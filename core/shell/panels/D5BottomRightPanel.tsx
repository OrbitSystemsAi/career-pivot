const phrases = [
  { current: "Managed", better: "Led" },
  { current: "Responsible for", better: "Owned" },
  { current: "Worked on", better: "Delivered" },
  { current: "Helped", better: "Enabled" },
];

export default function D5BottomRightPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Word Suggestions
      </div>

      <div className="flex flex-col gap-2">
        {phrases.map((phrase) => (
          <button
            key={phrase.current}
            className="grid grid-cols-[1fr_auto_1fr] items-center rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
          >
            <span>{phrase.current}</span>
            <span className="px-2 text-slate-300">→</span>
            <span>{phrase.better}</span>
          </button>
        ))}
      </div>
    </div>
  );
}