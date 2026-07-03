"use client";

import { useState } from "react";

const viewTypes = ["Visualization", "Graph", "Timeline", "Metrics"];

export default function D3WorkspaceControlsPanel() {
  const [activeView, setActiveView] = useState("Visualization");

  return (
    <div className="relative flex h-14 items-center justify-center border-b border-slate-200">
      <div className="flex gap-3">
        {viewTypes.map((view) => {
          const selected = activeView === view;

          return (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`rounded-xl px-2 py-3 text-xs font-medium transition ${
                selected
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {view}
            </button>
          );
        })}
      </div>
    </div>
  );
}