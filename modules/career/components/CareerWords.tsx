import { careerWords } from "../data/careerInsightData";

export default function CareerWords() {
  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Words
      </div>

      {careerWords.map((item) => (
        <button
          key={item.current}
          className="grid w-full grid-cols-[1fr_auto_1fr] rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
        >
          <span>{item.current}</span>
          <span>→</span>
          <span>{item.better}</span>
        </button>
      ))}
    </div>
  );
}