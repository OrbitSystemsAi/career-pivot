const graphNodes = [
  { label: "CIO", x: "50%", y: "12%", type: "future" },
  { label: "VP Digital Transformation", x: "50%", y: "26%", type: "future" },
  { label: "Director AI Transformation", x: "50%", y: "43%", type: "target" },
  { label: "Finance Leadership", x: "27%", y: "62%", type: "strength" },
  { label: "Healthcare Strategy", x: "73%", y: "62%", type: "gap" },
  { label: "Current Resume", x: "50%", y: "78%", type: "current" },
];

function getNodeStyle(type: string) {
  if (type === "target") return "border-blue-200 bg-blue-50 text-blue-600";
  if (type === "current") return "border-emerald-200 bg-emerald-50 text-emerald-600";
  if (type === "strength") return "border-slate-200 bg-white text-slate-600";
  if (type === "gap") return "border-amber-200 bg-amber-50 text-amber-600";
  return "border-slate-200 bg-white text-slate-500";
}

export default function D3VisualizationPanel() {
  return (
    <div className="relative flex flex-1 overflow-hidden bg-gradient-to-br from-white to-slate-50">
      <svg className="absolute inset-0 h-full w-full">
        <line x1="50%" y1="17%" x2="50%" y2="26%" className="stroke-slate-200" strokeWidth="2" />
        <line x1="50%" y1="31%" x2="50%" y2="43%" className="stroke-slate-200" strokeWidth="2" />
        <line x1="50%" y1="48%" x2="27%" y2="62%" className="stroke-slate-200" strokeWidth="2" />
        <line x1="50%" y1="48%" x2="73%" y2="62%" className="stroke-slate-200" strokeWidth="2" />
        <line x1="27%" y1="67%" x2="50%" y2="78%" className="stroke-slate-200" strokeWidth="2" />
        <line x1="73%" y1="67%" x2="50%" y2="78%" className="stroke-slate-200" strokeWidth="2" />
      </svg>

      {graphNodes.map((node) => (
        <button
          key={node.label}
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border px-4 py-3 text-xs font-medium shadow-sm hover:bg-blue-50 hover:text-blue-600 ${getNodeStyle(
            node.type
          )}`}
          style={{ left: node.x, top: node.y }}
        >
          {node.label}
        </button>
      ))}

      <div className="absolute bottom-4 left-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          Career Intelligence Graph
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Current resume mapped against target career path.
        </div>
      </div>
    </div>
  );
}