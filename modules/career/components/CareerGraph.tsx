import { careerGraphEdges, careerGraphNodes } from "../data/careerGraphData";

function getNodeStyle(type: string) {
  if (type === "target") return "border-blue-200 bg-blue-50 text-blue-600 shadow-blue-100";
  if (type === "current") return "border-emerald-200 bg-emerald-50 text-emerald-600 shadow-emerald-100";
  if (type === "strength") return "border-slate-200 bg-white text-slate-600 shadow-slate-100";
  if (type === "gap") return "border-amber-200 bg-amber-50 text-amber-600 shadow-amber-100";

  return "border-slate-200 bg-white text-slate-500 shadow-slate-100";
}

function getDotStyle(type: string) {
  if (type === "target") return "bg-blue-600";
  if (type === "current") return "bg-emerald-500";
  if (type === "gap") return "bg-amber-500";
  return "bg-slate-400";
}

export default function CareerGraph() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-8 rounded-[2rem] border border-slate-100 bg-white/40" />

      <svg className="absolute inset-0 h-full w-full">
        {careerGraphEdges.map((edge, index) => (
          <line
            key={index}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            className="stroke-slate-200"
            strokeWidth="2"
          />
        ))}
      </svg>

      {careerGraphNodes.map((node) => (
        <button
          key={node.label}
          className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-2xl border px-4 py-3 text-xs font-medium shadow-sm transition hover:bg-blue-50 hover:text-blue-600 ${getNodeStyle(
            node.type
          )}`}
          style={{ left: node.x, top: node.y }}
        >
          <span className={`h-2 w-2 rounded-full ${getDotStyle(node.type)}`} />
          <span>{node.label}</span>
          <span className="text-[10px] text-slate-400">{node.match}</span>
        </button>
      ))}

      <div className="absolute left-4 top-4 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Selected Path
        </div>
        <div className="mt-1 text-sm font-semibold text-slate-700">
          Finance → Healthcare AI Leadership
        </div>
      </div>

      <div className="absolute right-4 top-4 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Match Level
        </div>
        <div className="mt-1 text-2xl font-bold text-blue-600">72%</div>
      </div>
    </div>
  );
}