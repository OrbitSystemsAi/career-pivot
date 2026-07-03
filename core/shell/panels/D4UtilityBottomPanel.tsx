const companies = [
  { name: "Microsoft", count: 18 },
  { name: "Amazon", count: 14 },
  { name: "UnitedHealth", count: 11 },
  { name: "Salesforce", count: 9 },
];

export default function D4UtilityBottomPanel() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Top Companies
      </div>

      <div className="flex flex-1 flex-col justify-around">
        {companies.map((company) => (
          <button
            key={company.name}
            className="flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
          >
            <span>{company.name}</span>
            <span>{company.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}