const views = ["Resume", "Career", "Network"];

const viewTypes = [
  "Visualization",
  "Graph",
];

export default function D3WorkspaceControlsPanel() {
  return (
    <div className="relative flex h-14 items-center justify-center border-b border-slate-200">

      <select className="absolute left-4 rounded-xl border border-transparent bg-white px-4 py-3 text-xs font-medium text-slate-500 hover:border-slate-200 hover:bg-blue-50 hover:text-blue-600 focus:border-transparent focus:bg-white focus:outline-none">
        {viewTypes.map((type) => (
          <option key={type}>
            {type}
          </option>
        ))}
      </select>


      <div className="flex items-center justify-center gap-3">
        {views.map((view) => (
          <button
            key={view}
            className="rounded-xl px-4 py-3 text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
          >
            {view}
          </button>
        ))}
      </div>

    </div>
  );
}