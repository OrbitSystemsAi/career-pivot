const skills = [
  { name: "Finance Leadership", level: "Strong", status: "matched" },
  { name: "Business Intelligence", level: "Strong", status: "matched" },
  { name: "AI Governance", level: "Missing", status: "gap" },
  { name: "Healthcare Strategy", level: "Missing", status: "gap" },
  { name: "Enterprise Change", level: "Developing", status: "partial" },
];

export default function CareerSkills() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Career Skills
        </div>

        <div className="flex flex-col gap-2">
          {skills.map((skill) => (
            <button
              key={skill.name}
              className="flex justify-between rounded-xl px-4 py-3 text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
            >
              <span>{skill.name}</span>
              <span
                className={
                  skill.status === "matched"
                    ? "text-emerald-600"
                    : skill.status === "gap"
                      ? "text-amber-600"
                      : "text-blue-600"
                }
              >
                {skill.level}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}