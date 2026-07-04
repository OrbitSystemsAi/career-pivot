export default function CareerMarketDemand() {
  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Market Demand
      </div>

      {["AI Transformation", "Healthcare Tech", "Digital Operations", "BI Leadership"].map((item) => (
        <button
          key={item}
          className="flex w-full justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
        >
          <span>{item}</span>
          <span className="text-blue-600">High</span>
        </button>
      ))}
    </div>
  );
}