const milestones = [
  {
    label: "Current",
    title: "Senior Leader",
    detail: "Finance, BI, operations, and transformation foundation",
  },
  {
    label: "Next",
    title: "Director AI Transformation",
    detail: "Reposition resume around AI-enabled enterprise transformation",
  },
  {
    label: "Future",
    title: "VP Digital Transformation",
    detail: "Demonstrate broader enterprise ownership and measurable outcomes",
  },
  {
    label: "Executive",
    title: "CIO",
    detail: "Own enterprise strategy, governance, platforms, and transformation",
  },
];

export default function CareerTimeline() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Career Timeline
        </div>

        <div className="flex flex-col gap-3">
          {milestones.map((milestone) => (
            <div
              key={milestone.title}
              className="grid grid-cols-[96px_1fr] rounded-xl px-4 py-3 text-xs hover:bg-blue-50"
            >
              <div className="font-medium text-blue-600">{milestone.label}</div>

              <div>
                <div className="font-semibold text-slate-700">
                  {milestone.title}
                </div>

                <div className="mt-1 text-slate-500">
                  {milestone.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}