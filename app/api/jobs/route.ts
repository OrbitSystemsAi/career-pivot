import { NextRequest, NextResponse } from "next/server";
import type {
  FinanceTitleId,
  LiveJob,
  LiveJobsResponse,
  WorkMode,
} from "@/modules/jobs/types";

export const dynamic = "force-dynamic";

const SOURCE_CACHE_SECONDS = 21_600;
const MAX_RESULT_AGE_DAYS = 120;

const titleKeywords: Record<FinanceTitleId, string[]> = {
  "financial-analyst": ["financial analyst", "finance analyst"],
  "senior-financial-analyst": [
    "senior financial analyst",
    "sr financial analyst",
    "sr. financial analyst",
  ],
  fpa: ["fp&a", "financial planning", "planning and analysis"],
  "finance-manager": ["finance manager", "financial manager"],
  "accounting-manager": ["accounting manager", "manager accounting"],
  controller: ["controller", "assistant controller"],
  "finance-director": ["finance director", "director of finance"],
  treasury: ["treasury", "treasurer"],
  "risk-analyst": ["risk analyst", "financial risk"],
  "business-intelligence": [
    "business intelligence analyst",
    "finance business intelligence",
    "financial data analyst",
  ],
  accountant: [
    "accountant",
    "accounting",
    "accounts payable",
    "accounts receivable",
  ],
  "wealth-management": [
    "wealth management",
    "financial advisor",
    "client associate",
  ],
  "grants-finance": [
    "grants manager",
    "grants analyst",
    "research administrator",
  ],
};

const validModes = new Set<WorkMode>(["on-site", "remote", "hybrid"]);
const validTitles = new Set<FinanceTitleId>(
  Object.keys(titleKeywords) as FinanceTitleId[],
);

const southFloridaCities = [
  "aventura",
  "bal harbour",
  "boca raton",
  "coral gables",
  "davie",
  "deerfield beach",
  "doral",
  "fort lauderdale",
  "hallandale beach",
  "hialeah",
  "hollywood",
  "homestead",
  "lauderhill",
  "miami",
  "miami beach",
  "miramar",
  "north miami",
  "oakland park",
  "pembroke pines",
  "plantation",
  "pompano beach",
  "sunrise",
  "weston",
];

type JobicyJob = {
  id: number;
  url: string;
  jobTitle: string;
  companyName: string;
  jobGeo?: string;
  jobDescription?: string;
  jobExcerpt?: string;
  pubDate: string;
  annualSalaryMin?: number;
  annualSalaryMax?: number;
  salaryCurrency?: string;
};

type RemotiveJob = {
  id: number;
  url: string;
  title: string;
  company_name: string;
  candidate_required_location?: string;
  description?: string;
  publication_date: string;
  salary?: string;
};

type MuseJob = {
  id: number;
  name: string;
  contents?: string;
  publication_date: string;
  locations?: Array<{ name: string }>;
  refs?: { landing_page?: string };
  company?: { name?: string };
};

function decodeEntities(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"');
}

function stripHtml(value = "") {
  return decodeEntities(value.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function isRecent(date: string) {
  const timestamp = new Date(date).getTime();
  if (!Number.isFinite(timestamp)) return false;

  const ageDays = (Date.now() - timestamp) / 86_400_000;
  return ageDays >= -2 && ageDays <= MAX_RESULT_AGE_DAYS;
}

function matchesTitle(title: string, selectedTitles: FinanceTitleId[]) {
  const normalizedTitle = title.toLowerCase();
  return selectedTitles.some((id) =>
    titleKeywords[id].some((keyword) => normalizedTitle.includes(keyword)),
  );
}

function isSouthFloridaLocation(location: string) {
  const normalizedLocation = location.toLowerCase();
  return southFloridaCities.some((city) => normalizedLocation.includes(city));
}

function isUnitedStatesRemote(location = "") {
  const normalizedLocation = location.toLowerCase();
  if (!normalizedLocation) return false;

  return [
    "usa",
    "u.s.",
    "united states",
    "north america",
    "americas",
    "anywhere",
    "worldwide",
  ].some((term) => normalizedLocation.includes(term));
}

function extractSalary(description: string) {
  const text = stripHtml(description);
  const formatAmount = (value: string) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(value.replaceAll(",", "")));
  const range = text.match(
    /\$\s?([\d,]{2,}(?:\.\d{1,2})?)\s*(?:-|–|—|to)\s*\$?\s?([\d,]{2,}(?:\.\d{1,2})?)(?:\s*(?:per year|annually|a year|\/year))?/i,
  );
  if (range) return `${formatAmount(range[1])}–${formatAmount(range[2])}`;

  const single = text.match(
    /(?:salary|pay|compensation)[^$]{0,30}\$\s?([\d,]{2,}(?:\.\d{1,2})?)/i,
  );
  return single ? formatAmount(single[1]) : "Not listed publicly";
}

function extractHiringManager(description: string) {
  const text = stripHtml(description);
  const match = text.match(
    /(?:you will report|this role reports|reporting|reports)\s+(?:directly\s+)?to\s+(?:the\s+)?([^.;:]{3,80})/i,
  );

  if (!match) return "Not listed publicly";

  const manager = match[1].replace(/\s+/g, " ").trim();
  return manager.length <= 80 ? manager : "Not listed publicly";
}

function formatSalary(
  minimum?: number,
  maximum?: number,
  currency = "USD",
) {
  if (!minimum && !maximum) return "Not listed publicly";
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  if (minimum && maximum) return `${format.format(minimum)}–${format.format(maximum)}`;
  return format.format(minimum ?? maximum ?? 0);
}

async function fetchJson<T>(url: string, source: string, errors: string[]) {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: SOURCE_CACHE_SECONDS },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return (await response.json()) as T;
  } catch (error) {
    errors.push(`${source} unavailable: ${error instanceof Error ? error.message : "unknown error"}`);
    return undefined;
  }
}

async function getRemoteJobs(
  selectedTitles: FinanceTitleId[],
  errors: string[],
) {
  const searchTerms = Array.from(
    new Set(
      selectedTitles.flatMap((id) => titleKeywords[id]).slice(0, 4),
    ),
  );
  const [jobicy, ...remotiveFeeds] = await Promise.all([
    fetchJson<{ jobs?: JobicyJob[] }>(
      "https://jobicy.com/api/v2/remote-jobs?count=50&tag=finance",
      "Jobicy",
      errors,
    ),
    ...searchTerms.map((term) =>
      fetchJson<{ jobs?: RemotiveJob[] }>(
        `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(term)}&limit=50`,
        "Remotive",
        errors,
      ),
    ),
  ]);

  const jobicyJobs: LiveJob[] = (jobicy?.jobs ?? [])
    .filter(
      (job) =>
        matchesTitle(job.jobTitle, selectedTitles) &&
        isRecent(job.pubDate) &&
        isUnitedStatesRemote(job.jobGeo),
    )
    .map((job) => ({
      id: `jobicy-${job.id}`,
      company: job.companyName,
      title: stripHtml(job.jobTitle),
      salary: formatSalary(
        job.annualSalaryMin,
        job.annualSalaryMax,
        job.salaryCurrency,
      ),
      workType: "remote",
      location: job.jobGeo || "United States",
      hiringManager: extractHiringManager(
        job.jobDescription ?? job.jobExcerpt ?? "",
      ),
      url: job.url,
      source: "Jobicy",
      publishedAt: job.pubDate,
    }));

  const remotiveJobs: LiveJob[] = remotiveFeeds
    .flatMap((feed) => feed?.jobs ?? [])
    .filter(
      (job) =>
        matchesTitle(job.title, selectedTitles) &&
        isRecent(job.publication_date) &&
        isUnitedStatesRemote(job.candidate_required_location),
    )
    .map((job) => ({
      id: `remotive-${job.id}`,
      company: job.company_name,
      title: stripHtml(job.title),
      salary: job.salary?.trim() || extractSalary(job.description ?? ""),
      workType: "remote",
      location: job.candidate_required_location || "United States",
      hiringManager: extractHiringManager(job.description ?? ""),
      url: job.url,
      source: "Remotive",
      publishedAt: job.publication_date,
    }));

  return [...jobicyJobs, ...remotiveJobs];
}

async function getSouthFloridaJobs(
  selectedTitles: FinanceTitleId[],
  errors: string[],
) {
  const locations = ["Miami, FL", "Fort Lauderdale, FL"];
  const requests = locations.flatMap((location) =>
    [1, 2, 3, 4].map((page) =>
      fetchJson<{ results?: MuseJob[] }>(
        `https://www.themuse.com/api/public/jobs?page=${page}&location=${encodeURIComponent(location)}`,
        "The Muse",
        errors,
      ),
    ),
  );
  const feeds = await Promise.all(requests);

  return feeds
    .flatMap((feed) => feed?.results ?? [])
    .filter((job) => {
      const location = (job.locations ?? []).map((item) => item.name).join(", ");
      return (
        matchesTitle(job.name, selectedTitles) &&
        isRecent(job.publication_date) &&
        isSouthFloridaLocation(location)
      );
    })
    .map((job): LiveJob => {
      const description = job.contents ?? "";
      const location = (job.locations ?? [])
        .map((item) => item.name)
        .filter(isSouthFloridaLocation)
        .join(", ");
      const normalizedText = `${job.name} ${stripHtml(description)}`.toLowerCase();
      const workType: WorkMode = normalizedText.includes("hybrid")
        ? "hybrid"
        : "on-site";

      return {
        id: `muse-${job.id}`,
        company: job.company?.name ?? "Company not listed",
        title: stripHtml(job.name),
        salary: extractSalary(description),
        workType,
        location,
        hiringManager: extractHiringManager(description),
        url: job.refs?.landing_page ?? "",
        source: "The Muse",
        publishedAt: job.publication_date,
      };
    })
    .filter((job) => Boolean(job.url));
}

function deduplicate(jobs: LiveJob[]) {
  const uniqueJobs = new Map<string, LiveJob>();
  for (const job of jobs) {
    const key = `${job.company}-${job.title}`.toLowerCase().replace(/[^a-z0-9]/g, "");
    const current = uniqueJobs.get(key);
    if (!current || new Date(job.publishedAt) > new Date(current.publishedAt)) {
      uniqueJobs.set(key, job);
    }
  }
  return Array.from(uniqueJobs.values());
}

export async function GET(request: NextRequest) {
  const modeValues = request.nextUrl.searchParams.get("modes")?.split(",") ?? [];
  const titleValues = request.nextUrl.searchParams.get("titles")?.split(",") ?? [];
  const modes = modeValues.filter((value): value is WorkMode =>
    validModes.has(value as WorkMode),
  );
  const titles = titleValues.filter((value): value is FinanceTitleId =>
    validTitles.has(value as FinanceTitleId),
  );

  if (!modes.length || !titles.length) {
    return NextResponse.json(
      { error: "Select at least one work type and one finance title." },
      { status: 400 },
    );
  }

  const errors: string[] = [];
  const [remoteJobs, localJobs] = await Promise.all([
    modes.includes("remote") ? getRemoteJobs(titles, errors) : [],
    modes.some((mode) => mode === "on-site" || mode === "hybrid")
      ? getSouthFloridaJobs(titles, errors)
      : [],
  ]);
  const jobs = deduplicate([...remoteJobs, ...localJobs])
    .filter((job) => modes.includes(job.workType))
    .sort(
      (first, second) =>
        new Date(second.publishedAt).getTime() -
        new Date(first.publishedAt).getTime(),
    )
    .slice(0, 60);

  const response: LiveJobsResponse = {
    jobs,
    calculatedAt: new Date().toISOString(),
    sources: Array.from(new Set(jobs.map((job) => job.source))),
    errors: Array.from(new Set(errors)),
  };

  return NextResponse.json(response);
}
