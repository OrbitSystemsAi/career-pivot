import { careerGraphEdges, careerGraphNodes } from "../data/careerGraphData";

function getNodeStyle(type: string) {
  if (type === "target") return "border-blue-200 bg-blue-50 text-blue-600";
  if (type === "current") return "border-emerald-200 bg-emerald-50 text-emerald-600";
  if (type === "strength") return "border-slate-200 bg-white text-slate-600";
  if (type === "gap") return "border-amber-200 bg-amber-50 text-amber-600";

  return "border-slate-200 bg-white text-slate-500";
}

export default function CareerGraph() {
  return (
    <div className="relative h-full w-full">
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
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border px-4 py-3 text-xs font-medium shadow-sm hover:bg-blue-50 hover:text-blue-600 ${getNodeStyle(
            node.type
          )}`}
          style={{ left: node.x, top: node.y }}
        >
          {node.label}
        </button>
      ))}
    </div>
  );
}