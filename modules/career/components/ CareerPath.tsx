import { careerPath } from "../data/careerPathData";

export default function CareerPath() {
  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-slate-200 bg-white">
      <div className="grid h-14 shrink-0 grid-cols-2 border-b border-slate-200">
        {["Telemarketing", "Healthcare"].map((industry) => (
          <button
            key={industry}
            className="border-r border-slate-100 text-xs font-medium text-slate-500 last:border-r-0 hover:bg-blue-50 hover:text-blue-600"
          >
            {industry} <span className="ml-1">⌄</span>
          </button>
        ))}
      </div>

      <div className="relative flex-1 px-4 py-3">
        <div className="absolute bottom-6 left-[29px] top-6 w-px bg-slate-200" />

        <div className="flex flex-col gap-1">
          {careerPath.map((role) => {
            const isTarget = role.status === "target";
            const isCurrent = role.status === "current";

            return (
              <button
                key={role.title}
                className={`relative grid grid-cols-[28px_1fr_auto] items-center rounded-xl px-1 py-2 text-left text-xs font-medium ${
                  isTarget
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <span
                  className={`z-10 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                    isCurrent
                      ? "bg-emerald-500 text-white"
                      : isTarget
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {isCurrent ? "✓" : role.step}
                </span>

                <span className="truncate">{role.title}</span>
                <span className="pl-2">{role.count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}