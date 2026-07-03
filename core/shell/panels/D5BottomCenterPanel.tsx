const additions = [
  "Add healthcare transformation example",
  "Quantify AI automation impact",
  "Add governance / compliance language",
  "Include enterprise change leadership",
];

export default function D5BottomCenterPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Suggested Additions
      </div>

      <div className="flex flex-col gap-2">
        {additions.map((addition) => (
          <button
            key={addition}
            className="flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
          >
            <span>{addition}</span>
            <span className="text-blue-600">Add</span>
          </button>
        ))}
      </div>
    </div>
  );
}