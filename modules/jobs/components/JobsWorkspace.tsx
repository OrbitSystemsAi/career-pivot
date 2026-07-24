"use client";

import { useEffect, useState } from "react";
import type {
  FinanceTitleId,
  LiveJob,
  LiveJobsResponse,
  WorkMode,
} from "@/modules/jobs/types";

const workModeOptions: Array<{ id: WorkMode; label: string }> = [
  { id: "on-site", label: "On-site" },
  { id: "remote", label: "Remote" },
  { id: "hybrid", label: "Hybrid" },
];

const titleOptions: Array<{ id: FinanceTitleId; label: string }> = [
  { id: "financial-analyst", label: "Financial Analyst" },
  { id: "senior-financial-analyst", label: "Senior Financial Analyst" },
  { id: "fpa", label: "FP&A" },
  { id: "finance-manager", label: "Finance Manager" },
  { id: "accounting-manager", label: "Accounting Manager" },
  { id: "controller", label: "Controller" },
  { id: "finance-director", label: "Finance Director" },
  { id: "treasury", label: "Treasury" },
  { id: "risk-analyst", label: "Risk Analyst" },
  { id: "business-intelligence", label: "Business Intelligence Analyst" },
  { id: "accountant", label: "Accounting / Accountant" },
  { id: "wealth-management", label: "Wealth Management" },
  { id: "grants-finance", label: "Grants Finance" },
];

type FilterOption<T extends string> = { id: T; label: string };

function FilterDropdown<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: Array<FilterOption<T>>;
  selected: T[];
  onChange: (values: T[]) => void;
}) {
  function toggle(value: T) {
    const next = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    if (next.length) onChange(next);
  }

  const selectedLabels = options
    .filter((option) => selected.includes(option.id))
    .map((option) => option.label);

  return (
    <details className="group relative">
      <summary className="flex h-12 cursor-pointer list-none items-center justify-between rounded-xl border border-[#b7cbd0] bg-white px-4 text-left text-sm text-[#173a46] shadow-sm transition hover:border-[#168391] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168391] [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6f8299]">
            {label}
          </span>
          <span className="block max-w-[18rem] truncate font-medium">
            {selectedLabels.join(", ")}
          </span>
        </span>
        <span className="ml-4 text-[#2b6874] transition group-open:rotate-180">⌄</span>
      </summary>
      <div className="absolute left-0 top-14 z-30 w-full min-w-[17rem] rounded-xl border border-[#b7cbd0] bg-white p-2 shadow-[0_18px_45px_rgba(5,35,43,0.18)]">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#173a46] hover:bg-[#e8f2f3]"
          >
            <input
              type="checkbox"
              checked={selected.includes(option.id)}
              onChange={() => toggle(option.id)}
              className="h-4 w-4 accent-[#168391]"
            />
            {option.label}
          </label>
        ))}
      </div>
    </details>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function JobRow({ job }: { job: LiveJob }) {
  return (
    <article className="grid gap-4 border-b border-[#d6e8ea] px-5 py-5 last:border-b-0 lg:grid-cols-[minmax(0,1.3fr)_minmax(10rem,0.7fr)_auto] lg:items-center">
      <div className="min-w-0">
        <div className="text-xs font-semibold text-[#2b6874]">{job.company}</div>
        <h2 className="mt-1 text-lg font-semibold leading-6 text-[#102f39]">
          {job.title}
        </h2>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#64748b]">
          <span>{job.location}</span>
          <span>Posted {formatDate(job.publishedAt)}</span>
          <span>Source: {job.source}</span>
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-x-5 gap-y-3 text-xs lg:grid-cols-1">
        <div>
          <dt className="text-[#7c8da3]">Salary</dt>
          <dd className="mt-0.5 font-semibold text-[#173a46]">{job.salary}</dd>
        </div>
        <div>
          <dt className="text-[#7c8da3]">Work type</dt>
          <dd className="mt-0.5 font-semibold capitalize text-[#173a46]">
            {job.workType}
          </dd>
        </div>
        <div className="col-span-2 lg:col-span-1">
          <dt className="text-[#7c8da3]">Hiring manager</dt>
          <dd className="mt-0.5 font-semibold text-[#173a46]">
            {job.hiringManager}
          </dd>
        </div>
      </dl>
      <a
        href={job.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-10 items-center justify-center rounded-lg bg-[#164858] px-4 text-xs font-semibold text-white transition hover:bg-[#f28c28] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168391] focus-visible:ring-offset-2"
      >
        View posting ↗
      </a>
    </article>
  );
}

export default function JobsWorkspace() {
  const [workModes, setWorkModes] = useState<WorkMode[]>([
    "on-site",
    "remote",
  ]);
  const [titles, setTitles] = useState<FinanceTitleId[]>(() =>
    titleOptions.map((option) => option.id),
  );
  const [jobs, setJobs] = useState<LiveJob[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [calculatedAt, setCalculatedAt] = useState("");
  const [isCalculating, setIsCalculating] = useState(true);
  const [requestError, setRequestError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsCalculating(true);
      setRequestError("");

      try {
        const query = new URLSearchParams({
          modes: workModes.join(","),
          titles: titles.join(","),
        });
        const [response] = await Promise.all([
          fetch(`/api/jobs?${query}`, { signal: controller.signal }),
          new Promise((resolve) => window.setTimeout(resolve, 450)),
        ]);
        if (!response.ok) throw new Error("Live job search is unavailable.");

        const data = (await response.json()) as LiveJobsResponse;
        setJobs(data.jobs);
        setSources(data.sources);
        setErrors(data.errors);
        setCalculatedAt(data.calculatedAt);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setJobs([]);
        setRequestError(
          error instanceof Error ? error.message : "Live job search is unavailable.",
        );
      } finally {
        if (!controller.signal.aborted) setIsCalculating(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [titles, workModes]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-[#173a46]">
      <section className="relative z-20 border-b border-[#c8dfe9] bg-[#f8fcfe] px-6 py-5">
        <div className="grid max-w-5xl gap-3 md:grid-cols-2">
          <FilterDropdown
            label="Work arrangement"
            options={workModeOptions}
            selected={workModes}
            onChange={(values) => {
              setIsCalculating(true);
              setWorkModes(values);
            }}
          />
          <FilterDropdown
            label="Finance titles"
            options={titleOptions}
            selected={titles}
            onChange={(values) => {
              setIsCalculating(true);
              setTitles(values);
            }}
          />
        </div>
        <div
          role="status"
          aria-live="polite"
          className={`mt-3 h-5 text-xs font-semibold uppercase tracking-[0.12em] ${
            isCalculating ? "text-[#f28c28]" : "text-[#2b6874]"
          }`}
        >
          {isCalculating
            ? "Calculating"
            : `${jobs.length} matching live ${jobs.length === 1 ? "job" : "jobs"}`}
        </div>
      </section>

      <section className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-[#c8dfe9] bg-white shadow-sm">
          {requestError ? (
            <div className="px-6 py-16 text-center">
              <div className="text-lg font-semibold text-[#102f39]">
                Live search could not be completed
              </div>
              <p className="mt-2 text-sm text-[#64748b]">{requestError}</p>
            </div>
          ) : jobs.length ? (
            jobs.map((job) => <JobRow key={job.id} job={job} />)
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="text-lg font-semibold text-[#102f39]">
                {isCalculating ? "Checking live sources" : "No exact matches found"}
              </div>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#64748b]">
                {isCalculating
                  ? "The list will update when the current calculation finishes."
                  : "No current posting satisfied every selected title, work-type, and location rule. Adjust a filter to calculate again."}
              </p>
            </div>
          )}
        </div>

        {!isCalculating && !requestError ? (
          <div className="mx-auto mt-4 flex max-w-7xl flex-wrap items-center justify-between gap-2 text-[11px] text-[#7c8da3]">
            <span>
              Free live sources: {sources.length ? sources.join(", ") : "No matching source"}
            </span>
            <span>
              {calculatedAt
                ? `Calculated ${new Date(calculatedAt).toLocaleString()}`
                : ""}
            </span>
          </div>
        ) : null}
        {errors.length && !jobs.length ? (
          <p className="mx-auto mt-2 max-w-7xl text-[11px] text-[#9a5715]">
            Some free sources were unavailable during this calculation.
          </p>
        ) : null}
      </section>
    </div>
  );
}
