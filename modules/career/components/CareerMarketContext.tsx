export default function CareerMarketContext() {
  const items = [
    "AI leadership demand increasing",
    "Healthcare transformation expanding",
    "Remote executive roles competitive",
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Market Intelligence
      </div>

      {items.map((item) => (
        <button
          key={item}
          className="rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
        >
          {item}
        </button>
      ))}
    </div>
  );
}