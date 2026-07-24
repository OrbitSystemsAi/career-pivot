"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ModalPortal from "@/core/ui/ModalPortal";
import type { UserIndustryJobHistory } from "@/core/user/userTypes";
import type {
  IndustryDuration,
  IndustryExperienceData,
} from "@/modules/home/lib/industryExperience";

type IndustriesVennTileProps = {
  data: IndustryExperienceData;
  onSaveJobs: (jobs: UserIndustryJobHistory[]) => void;
};

type TreeMapIndustry = IndustryDuration & {
  x: number;
  y: number;
  width: number;
  height: number;
};

type EditableIndustryJob = UserIndustryJobHistory & {
  groupId: string;
};

const treeMapColors = [
  "#164b68",
  "#248ba3",
  "#36b7df",
  "#2458c6",
  "#ff7a00",
  "#2f679e",
  "#6fcfe5",
  "#327383",
];
const editorInputClass =
  "mt-0.5 h-9 w-full rounded-lg border border-transparent bg-transparent px-2 text-sm text-[#123743] outline-none transition hover:border-[#c6dce2] hover:bg-white focus:border-[#1689a3] focus:bg-white focus:ring-4 focus:ring-[#cdeef5]";

function formatYears(months: number) {
  const years = months / 12;
  const displayedYears = Number.isInteger(years)
    ? years
    : Number(years.toFixed(1));
  return `${displayedYears} ${displayedYears === 1 ? "yr" : "yrs"}`;
}

function TreeMapLabel({
  industry,
  months,
  compact,
}: {
  industry: string;
  months: number;
  compact: boolean;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const measurementRef = useRef<HTMLSpanElement>(null);
  const [labelLayout, setLabelLayout] = useState({
    fontSize: compact ? 10 : 14,
    vertical: false,
  });

  useLayoutEffect(() => {
    const box = boxRef.current;
    const measurement = measurementRef.current;

    if (!box || !measurement) {
      return;
    }

    const updateDirection = () => {
      const availableWidth = Math.max(1, box.clientWidth - 16);
      const availableHeight = Math.max(1, box.clientHeight - 38);
      const measuredWidth = Math.max(1, measurement.getBoundingClientRect().width);
      const baseFontSize = compact ? 10 : 14;
      const horizontalFontSize = Math.min(
        baseFontSize,
        (availableWidth / measuredWidth) * 14,
      );
      const shouldRotate =
        horizontalFontSize < 8 &&
        availableHeight > availableWidth &&
        availableHeight >= measuredWidth * (7 / 14);

      const fontSize = shouldRotate
        ? Math.min(10, (availableHeight / measuredWidth) * 14)
        : Math.max(6, horizontalFontSize);

      setLabelLayout((current) => {
        const next = {
          fontSize: Number(fontSize.toFixed(2)),
          vertical: shouldRotate,
        };

        return current.fontSize === next.fontSize &&
          current.vertical === next.vertical
          ? current
          : next;
      });
    };

    updateDirection();
    const observer = new ResizeObserver(updateDirection);
    observer.observe(box);
    return () => observer.disconnect();
  }, [compact, industry]);

  return (
    <div className="absolute inset-0 overflow-hidden" ref={boxRef}>
      <span
        aria-hidden="true"
        className="pointer-events-none invisible absolute whitespace-nowrap text-sm font-bold"
        ref={measurementRef}
      >
        {industry}
      </span>
      <span
        className={`absolute left-2 top-2 max-h-[calc(100%-38px)] max-w-[calc(100%-16px)] overflow-hidden whitespace-nowrap font-bold leading-none tracking-[-.02em] ${
          labelLayout.vertical ? "bottom-[30px]" : "right-2"
        }`}
        style={labelLayout.vertical
          ? {
              fontSize: `${labelLayout.fontSize}px`,
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              writingMode: "vertical-rl",
            }
          : { fontSize: `${labelLayout.fontSize}px` }
        }
      >
        {industry}
      </span>
      <span className="absolute bottom-2 left-2 whitespace-nowrap text-[10px] font-normal leading-none [text-orientation:mixed] [writing-mode:horizontal-tb]">
        {formatYears(months)}
      </span>
    </div>
  );
}

function layoutTreeMap(
  industries: IndustryDuration[],
  x = 0,
  y = 0,
  width = 100,
  height = 100,
): TreeMapIndustry[] {
  if (industries.length === 0) {
    return [];
  }

  if (industries.length === 1) {
    return [{ ...industries[0], x, y, width, height }];
  }

  const total = industries.reduce((sum, industry) => sum + industry.months, 0);
  let firstTotal = 0;
  let splitIndex = 1;

  for (let index = 0; index < industries.length - 1; index += 1) {
    const nextTotal = firstTotal + industries[index].months;
    if (Math.abs(total / 2 - nextTotal) <= Math.abs(total / 2 - firstTotal)) {
      firstTotal = nextTotal;
      splitIndex = index + 1;
    } else {
      break;
    }
  }

  const first = industries.slice(0, splitIndex);
  const second = industries.slice(splitIndex);
  const ratio = total > 0 ? firstTotal / total : first.length / industries.length;

  if (width >= height) {
    const firstWidth = width * ratio;
    return [
      ...layoutTreeMap(first, x, y, firstWidth, height),
      ...layoutTreeMap(second, x + firstWidth, y, width - firstWidth, height),
    ];
  }

  const firstHeight = height * ratio;
  return [
    ...layoutTreeMap(first, x, y, width, firstHeight),
    ...layoutTreeMap(second, x, y + firstHeight, width, height - firstHeight),
  ];
}

function createEmptyJob(): UserIndustryJobHistory {
  return {
    id: `industry-job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    industry: "",
    title: "",
    company: "",
    startDate: "",
    endDate: "",
  };
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function toDateInputValue(value?: string) {
  if (!value || /^(present|current)$/i.test(value.trim())) {
    return "";
  }

  const isoDate = value.match(/^((?:19|20)\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/);
  if (isoDate) {
    return `${isoDate[1]}-${isoDate[2]}-${isoDate[3]}`;
  }

  const isoMonth = value.match(/^((?:19|20)\d{2})-(0[1-9]|1[0-2])$/);
  if (isoMonth) {
    return `${isoMonth[1]}-${isoMonth[2]}-01`;
  }

  const numeric = value.match(/^(0?[1-9]|1[0-2])\/((?:19|20)\d{2})$/);
  if (numeric) {
    return `${numeric[2]}-${numeric[1].padStart(2, "0")}-01`;
  }

  const named = value.match(/^([A-Za-z]+)\.?\s+((?:19|20)\d{2})$/);
  if (named) {
    const monthIndex = monthNames.findIndex((month) =>
      named[1].toLowerCase().startsWith(month.toLowerCase()),
    );
    if (monthIndex >= 0) {
      return `${named[2]}-${String(monthIndex + 1).padStart(2, "0")}-01`;
    }
  }

  const year = value.match(/^((?:19|20)\d{2})$/)?.[1];
  return year ? `${year}-01-01` : "";
}

function formatMonth(value?: string, isEnd = false) {
  const dateValue = toDateInputValue(value);
  if (!dateValue) {
    return isEnd ? "Present" : "Start date";
  }

  const [year, month] = dateValue.split("-");
  return `${monthNames[Number(month) - 1]} ${year}`;
}

function openDatePicker(inputId: string) {
  const input = document.getElementById(inputId) as HTMLInputElement | null;

  if (!input) {
    return;
  }

  if (typeof input.showPicker === "function") {
    try {
      input.showPicker();
      return;
    } catch {
      // Some embedded browsers reject showPicker without a trusted gesture.
    }
  }

  input.focus();
  input.click();
}

function createEditableJobs(jobs: UserIndustryJobHistory[]): EditableIndustryJob[] {
  const groupIds = new Map<string, string>();

  return jobs.map((job) => {
    const industryKey = job.industry.trim().toLowerCase();
    const groupId = industryKey
      ? groupIds.get(industryKey) ?? `industry-${job.id}`
      : `unassigned-${job.id}`;

    if (industryKey && !groupIds.has(industryKey)) {
      groupIds.set(industryKey, groupId);
    }

    return { ...job, groupId };
  });
}

function reconcileEditableJobs(
  drafts: EditableIndustryJob[],
  sourceJobs: UserIndustryJobHistory[],
) {
  return drafts.map((draftJob) => {
    const sourceJob = sourceJobs.find(
      (job) =>
        job.id === draftJob.id ||
        (job.company.trim().toLowerCase() ===
          draftJob.company.trim().toLowerCase() &&
          job.company.trim().length > 0),
    );

    if (!sourceJob) {
      return draftJob;
    }

    return {
      ...draftJob,
      title:
        draftJob.title.trim().toLowerCase() === "role" &&
        sourceJob.title.trim().toLowerCase() !== "role"
          ? sourceJob.title
          : draftJob.title,
      startDate: draftJob.startDate || sourceJob.startDate || "",
      endDate: draftJob.endDate || sourceJob.endDate || "",
    };
  });
}

export default function IndustriesVennTile({
  data,
  onSaveJobs,
}: IndustriesVennTileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftJobs, setDraftJobs] = useState<EditableIndustryJob[]>([]);
  const dialogTitleId = useId();
  const treeMap = useMemo(
    () =>
      layoutTreeMap(
        data.industries
          .filter(({ months }) => months > 0)
          .toSorted((first, second) => second.months - first.months),
      ),
    [data.industries],
  );
  const reconciledDraftJobs = useMemo(
    () => reconcileEditableJobs(draftJobs, data.jobs),
    [data.jobs, draftJobs],
  );
  const groupedDraftJobs = useMemo(() => {
    const grouped = new Map<string, EditableIndustryJob[]>();

    for (const job of reconciledDraftJobs) {
      grouped.set(job.groupId, [...(grouped.get(job.groupId) ?? []), job]);
    }

    return Array.from(grouped, ([groupId, jobs]) => ({
      groupId,
      industry: jobs[0]?.industry.trim() || "Industry not assigned",
      jobs,
    }));
  }, [reconciledDraftJobs]);

  const openEditor = () => {
    setDraftJobs(createEditableJobs(data.jobs));
    setIsOpen(true);
  };

  const updateDraftJob = (
    jobId: string,
    field: keyof Omit<UserIndustryJobHistory, "id">,
    value: string,
  ) => {
    setDraftJobs((current) =>
      current.map((job) =>
        job.id === jobId ? { ...job, [field]: value } : job,
      ),
    );
  };

  const saveJobs = () => {
    onSaveJobs(
      reconciledDraftJobs
        .map((job) => ({
          id: job.id,
          industry: job.industry.trim(),
          title: job.title.trim(),
          company: job.company.trim(),
          startDate: job.startDate?.trim() || undefined,
          endDate: job.endDate?.trim() || "Present",
        }))
        .filter((job) => job.industry || job.title || job.company),
    );
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <>
      <article className="relative h-full min-h-36 overflow-hidden border-0 bg-white shadow-none ring-0">
        <div className="group relative h-full min-h-36 w-full overflow-hidden border-0 bg-transparent p-6 text-left text-[#123743] shadow-none outline-none ring-0">
          <div className="relative h-full transition duration-300 group-hover:scale-[.992] group-hover:blur-[2.5px] group-focus-within:scale-[.992] group-focus-within:blur-[2.5px]">
            <div className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#567987]">
              Industries
            </div>

            {treeMap.length > 0 ? (
              <div
                aria-label="Industry experience treemap weighted by total time"
                className="absolute inset-x-0 bottom-0 top-14 overflow-hidden bg-white"
                role="img"
              >
                {treeMap.map((industry, index) => {
                  const compact = industry.width < 28 || industry.height < 24;

                  return (
                    <div
                      className="absolute min-h-0 min-w-0 overflow-hidden border-2 border-white text-white"
                      key={industry.industry}
                      style={{
                        backgroundColor: treeMapColors[index % treeMapColors.length],
                        height: `${industry.height}%`,
                        left: `${industry.x}%`,
                        top: `${industry.y}%`,
                        width: `${industry.width}%`,
                      }}
                      title={`${industry.industry}: ${formatYears(industry.months)}`}
                    >
                      <TreeMapLabel
                        compact={compact}
                        industry={industry.industry}
                        months={industry.months}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="absolute inset-x-0 bottom-0 top-8 flex items-center text-xl font-semibold tracking-[-.03em] text-[#123743]">
                Add résumé dates to map your industry tenure
              </div>
            )}
          </div>

          <button
            aria-label="Edit industries and job history"
            className="absolute left-6 top-10 z-10 text-[9px] font-semibold uppercase tracking-[.15em] text-[#248ba3] opacity-0 transition hover:text-[#ff7a00] focus:opacity-100 focus:text-[#ff7a00] group-hover:opacity-100 group-focus-within:opacity-100"
            onClick={openEditor}
            type="button"
          >
            Edit
          </button>
        </div>
      </article>

      {isOpen ? (
        <ModalPortal>
        <div
          aria-labelledby={dialogTitleId}
          aria-modal="true"
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#092736]/65 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setIsOpen(false);
            }
          }}
          role="dialog"
        >
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <header className="flex items-start justify-between gap-6 border-b border-[#dce9ed] px-7 py-6">
              <div>
                <h2
                  className="text-3xl font-semibold tracking-[-.045em] text-[#123743]"
                  id={dialogTitleId}
                >
                  Edit industries &amp; job history
                </h2>
                <p className="mt-1 text-sm text-[#64748b]">
                  Review the industry assigned to each role. Saved changes update this diagram without altering your uploaded résumé.
                </p>
              </div>
              <button
                className="text-sm font-semibold text-[#64748b] transition hover:text-[#ff7a00]"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Close
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-7 py-6">
              {groupedDraftJobs.length > 0 ? (
                <div className="space-y-6">
                  {groupedDraftJobs.map((group, groupIndex) => (
                    <section key={group.groupId}>
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="text-sm font-semibold uppercase tracking-[.16em] text-[#567987]">
                          {group.industry}
                        </h3>
                        <span className="text-xs text-[#78909a]">
                          {group.jobs.length} job{group.jobs.length === 1 ? "" : "s"}
                        </span>
                      </div>

                      <div className="mt-3 space-y-3">
                        {group.jobs.map((job, jobIndex) => {
                          const itemNumber = `${groupIndex + 1}.${jobIndex + 1}`;

                          return (
                            <article
                              className="rounded-2xl bg-[#f3f8f9] p-3"
                              key={job.id}
                            >
                              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1.15fr_1.15fr]">
                                <label className="text-xs font-semibold text-[#294653]">
                                  Industry
                                  <input
                                    aria-label={`Industry for job ${itemNumber}`}
                                    className={editorInputClass}
                                    onChange={(event) =>
                                      updateDraftJob(job.id, "industry", event.target.value)
                                    }
                                    placeholder="e.g. Finance"
                                    value={job.industry}
                                  />
                                </label>
                                <label className="text-xs font-semibold text-[#294653]">
                                  Job title
                                  <input
                                    aria-label={`Title for job ${itemNumber}`}
                                    className={editorInputClass}
                                    onChange={(event) =>
                                      updateDraftJob(job.id, "title", event.target.value)
                                    }
                                    placeholder="Role or title"
                                    value={job.title}
                                  />
                                </label>
                                <label className="text-xs font-semibold text-[#294653]">
                                  Company
                                  <input
                                    aria-label={`Company for job ${itemNumber}`}
                                    className={editorInputClass}
                                    onChange={(event) =>
                                      updateDraftJob(job.id, "company", event.target.value)
                                    }
                                    placeholder="Company or organization"
                                    value={job.company}
                                  />
                                </label>
                              </div>

                              <div className="relative mt-2 flex items-center justify-between gap-2">
                                <div className="group/date flex min-h-9 flex-wrap items-center gap-2 rounded-lg border border-transparent bg-transparent px-2 text-sm font-semibold text-[#294653] transition hover:border-[#c6dce2] hover:bg-white focus-within:border-[#1689a3] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#cdeef5]">
                                  <span>{formatMonth(job.startDate)}</span>
                                  <button
                                    aria-label={`Choose start date for job ${itemNumber}`}
                                    className="grid size-4 place-items-center rounded text-[#567987] opacity-0 transition hover:bg-[#e9f5f7] hover:text-[#ff7a00] focus:opacity-100 group-hover/date:opacity-100 group-focus-within/date:opacity-100"
                                    onClick={() => openDatePicker(`start-${job.id}`)}
                                    type="button"
                                  >
                                    <svg aria-hidden="true" fill="none" height="9" viewBox="0 0 24 24" width="9">
                                      <path d="M7 3v3M17 3v3M4.5 9.5h15M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
                                    </svg>
                                  </button>
                                  <input
                                    aria-label={`Start date for job ${itemNumber}`}
                                    className="pointer-events-none absolute size-px opacity-0"
                                    id={`start-${job.id}`}
                                    onInput={(event) =>
                                      updateDraftJob(job.id, "startDate", event.currentTarget.value)
                                    }
                                    tabIndex={-1}
                                    type="date"
                                    value={toDateInputValue(job.startDate)}
                                  />

                                  <span className="font-normal text-[#78909a]">to</span>

                                  <span>{formatMonth(job.endDate, true)}</span>
                                  <button
                                    aria-label={`Choose end date for job ${itemNumber}`}
                                    className="grid size-4 place-items-center rounded text-[#567987] opacity-0 transition hover:bg-[#e9f5f7] hover:text-[#ff7a00] focus:opacity-100 group-hover/date:opacity-100 group-focus-within/date:opacity-100"
                                    onClick={() => openDatePicker(`end-${job.id}`)}
                                    type="button"
                                  >
                                    <svg aria-hidden="true" fill="none" height="9" viewBox="0 0 24 24" width="9">
                                      <path d="M7 3v3M17 3v3M4.5 9.5h15M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
                                    </svg>
                                  </button>
                                  <input
                                    aria-label={`End date for job ${itemNumber}`}
                                    className="pointer-events-none absolute size-px opacity-0"
                                    id={`end-${job.id}`}
                                    onInput={(event) =>
                                      updateDraftJob(job.id, "endDate", event.currentTarget.value)
                                    }
                                    tabIndex={-1}
                                    type="date"
                                    value={toDateInputValue(job.endDate)}
                                  />
                                </div>
                                <button
                                  aria-label={`Delete job ${itemNumber}`}
                                  className="h-9 rounded-lg px-3 text-sm font-semibold text-[#a64218] transition hover:bg-[#fff0e7]"
                                  onClick={() =>
                                    setDraftJobs((current) =>
                                      current.filter((item) => item.id !== job.id),
                                    )
                                  }
                                  type="button"
                                >
                                  Delete
                                </button>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-[#f3f8f9] p-6 text-center">
                  <p className="font-semibold text-[#123743]">No job history yet</p>
                  <p className="mt-1 text-sm text-[#64748b]">
                    Add a job to begin mapping your industry experience.
                  </p>
                </div>
              )}
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#dce9ed] px-7 py-5">
              <button
                className="rounded-xl border border-[#bfd3d8] px-5 py-3 text-sm font-semibold text-[#294653] transition hover:border-[#1689a3] hover:bg-[#eef8fa]"
                onClick={() => {
                  const job = createEmptyJob();
                  setDraftJobs((current) => [
                    ...current,
                    { ...job, groupId: `new-${job.id}` },
                  ]);
                }}
                type="button"
              >
                Add job
              </button>
              <div className="flex gap-3">
                <button
                  className="px-4 py-3 text-sm font-semibold text-[#64748b] transition hover:text-[#123743]"
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded-xl bg-[#164b68] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff7a00]"
                  onClick={saveJobs}
                  type="button"
                >
                  Save changes
                </button>
              </div>
            </footer>
          </div>
        </div>
        </ModalPortal>
      ) : null}
    </>
  );
}
