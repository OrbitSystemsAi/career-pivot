export default function CareerMarketRanking() {
  const companies = [
    { name: "Optum", score: "92%" },
    { name: "Humana", score: "87%" },
    { name: "Salesforce Health", score: "81%" },
  ];

  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Company Fit
      </div>

      {companies.map((company) => (
        <button
          key={company.name}
          className="flex w-full justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
        >
          <span>{company.name}</span>
          <span className="text-blue-600">{company.score}</span>
        </button>
      ))}
    </div>
  );
}