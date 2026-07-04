export default function CareerMarketFilters() {
  const filters = ["Remote", "Hybrid", "$150K+", "Healthcare"];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Market Filters
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            className="rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}