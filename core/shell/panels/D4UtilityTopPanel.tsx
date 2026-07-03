"use client";

import { useState } from "react";

const workSetups = ["Remote", "Hybrid", "Onsite", "Flexible"];

export default function D4UtilityTopPanel() {
  const [selectedWorkSetups, setSelectedWorkSetups] = useState(["Remote"]);
  const [salaryRange, setSalaryRange] = useState(250000);

  function toggleWorkSetup(option: string) {
    setSelectedWorkSetups((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option]
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="grid h-14 grid-cols-4 border-b border-slate-200">
        {workSetups.map((option) => {
          const selected = selectedWorkSetups.includes(option);

          return (
            <button
              key={option}
              onClick={() => toggleWorkSetup(option)}
              className={`border-r border-slate-100 text-xs font-medium last:border-r-0 ${
                selected
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="px-4 py-4">
        <div className="mb-2 flex justify-between text-xs font-medium text-slate-500">
          <span>$0</span>
          <span>{salaryRange >= 500000 ? "Unlimited" : `$${salaryRange.toLocaleString()}+`}</span>
        </div>

        <input
          type="range"
          min="0"
          max="500000"
          step="10000"
          value={salaryRange}
          onChange={(event) => setSalaryRange(Number(event.target.value))}
          className="w-full cursor-pointer accent-blue-600"
        />
      </div>
    </div>
  );
}