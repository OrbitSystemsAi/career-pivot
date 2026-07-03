"use client";

import { useState } from "react";

const metricGroups = [
  [
    { label: "Profile Strength", value: "84%", delta: "↑ +6%" },
    { label: "Career Match", value: "72%", delta: "↑ +12%" },
    { label: "Market Reach", value: "1.2K", delta: "↑ +18%" },
    { label: "Opportunity Score", value: "91", delta: "↑ +4%" },
  ],
  [
    { label: "Experience", value: "22 yrs", delta: "—" },
    { label: "Skills Matched", value: "48", delta: "↑ +5" },
    { label: "Missing Skills", value: "7", delta: "↓ -3" },
    { label: "Achievement Score", value: "82%", delta: "↑ +8%" },
  ],
  [
    { label: "Views", value: "1.2K", delta: "↑ +22%" },
    { label: "Connections", value: "438", delta: "↑ +14%" },
    { label: "Recruiter Matches", value: "37", delta: "↑ +8" },
    { label: "Offers", value: "3", delta: "↑ +1" },
  ],
];

export default function D3WorkspaceHeaderPanel() {
  const [activeGroup, setActiveGroup] = useState(0);

  function rotateLeft() {
    setActiveGroup((current) =>
      current === 0 ? metricGroups.length - 1 : current - 1
    );
  }

  function rotateRight() {
    setActiveGroup((current) =>
      current === metricGroups.length - 1 ? 0 : current + 1
    );
  }

  const metrics = metricGroups[activeGroup];

  return (
    <div className="grid h-20 grid-cols-[56px_1fr_1fr_1fr_1fr_56px] border-b border-slate-200">
      <button
        onClick={rotateLeft}
        className="flex items-center justify-center border-r border-slate-100 text-xl font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
      >
        ‹
      </button>

      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="flex items-center justify-center border-r border-slate-100 hover:bg-blue-50"
        >
          <div>
            <div className="flex items-baseline gap-2">
              <div className="text-lg font-bold text-slate-900">
                {metric.value}
              </div>
              <div className="text-[11px] font-medium text-emerald-600">
                {metric.delta}
              </div>
            </div>

            <div className="text-xs text-slate-500">{metric.label}</div>
          </div>
        </div>
      ))}

      <button
        onClick={rotateRight}
        className="flex items-center justify-center text-xl font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
      >
        ›
      </button>
    </div>
  );
}