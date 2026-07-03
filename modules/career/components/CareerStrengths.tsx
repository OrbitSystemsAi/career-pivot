import { careerStrengths } from "../data/careerInsightData";

export default function CareerStrengths() {
  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Strengths
      </div>

      {careerStrengths.map((item) => (
        <button
          key={item.name}
          className="flex w-full justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
        >
          <span>{item.name}</span>
          <span className="text-emerald-600">{item.score}</span>
        </button>
      ))}
    </div>
  );
}