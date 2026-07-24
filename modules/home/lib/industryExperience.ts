import type { ResumeExperience } from "@/core/resumeParsing/resumeStructureTypes";
import type {
  UserIndustryJobHistory,
  UserProfile,
} from "@/core/user/userTypes";
import { getResumeIntelligence } from "@/modules/resume/lib/resumeIntelligence";

export type IndustryDuration = {
  industry: string;
  months: number;
  roleCount: number;
};

export type IndustryOverlap = {
  first: string;
  second: string;
  months: number;
};

export type IndustryExperienceData = {
  industries: IndustryDuration[];
  overlaps: IndustryOverlap[];
  hasDatedEvidence: boolean;
  jobs: UserIndustryJobHistory[];
};

type ExperienceSignal = {
  industries: string[];
  start: Date | null;
  end: Date | null;
  months: number;
};

const industrySignals: Array<[string, RegExp]> = [
  ["Finance", /\b(finance|financial|accounting|treasury|banking|investment|fp&a|budget|forecast)\b/i],
  ["Technology", /\b(technology|software|digital|data|analytics|business intelligence|information systems|automation|ai|cloud|oracle|netsuite|ukg)\b/i],
  ["Healthcare", /\b(healthcare|health care|clinical|patient|hospital|medical|pharma)\b/i],
  ["Retail & Consumer", /\b(retail|consumer|merchandising|ecommerce|e-commerce|store operations)\b/i],
  ["Manufacturing", /\b(manufacturing|industrial|production|plant operations)\b/i],
  ["Supply Chain", /\b(supply chain|logistics|procurement|distribution|warehouse)\b/i],
  ["Marketing & Media", /\b(marketing|advertising|brand|media|content|communications)\b/i],
  ["Education", /\b(education|academic|university|college|school)\b/i],
  ["Government", /\b(government|public sector|municipal|federal|state agency)\b/i],
  ["Construction", /\b(construction|contractor|building trades|civil engineering)\b/i],
];

const monthIndexes: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const datePoint =
  "(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\\.?\\s+)?(?:19|20)\\d{2}|(?:0?[1-9]|1[0-2])\\/(?:19|20)\\d{2}";
const dateRangePattern = new RegExp(
  `(${datePoint})\\s*(?:-|–|—|to)\\s*(Present|Current|${datePoint})`,
  "i",
);
const preciseDatePoint =
  "(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\\.?\\s+(?:19|20)\\d{2}|(?:0?[1-9]|1[0-2])\\/(?:19|20)\\d{2}|(?:19|20)\\d{2}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\\d|3[01]))?)";

function parseDatePoint(value: string, isEnd = false) {
  if (/^(present|current)$/i.test(value.trim())) {
    return new Date();
  }

  const isoDate = value.match(
    /^((?:19|20)\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  );
  if (isoDate) {
    return new Date(
      Number(isoDate[1]),
      Number(isoDate[2]) - 1,
      Number(isoDate[3]),
    );
  }

  const isoMonth = value.match(/^((?:19|20)\d{2})-(0[1-9]|1[0-2])$/);
  if (isoMonth) {
    return new Date(Number(isoMonth[1]), Number(isoMonth[2]) - 1, 1);
  }

  const numeric = value.match(/\b(0?[1-9]|1[0-2])\/((?:19|20)\d{2})\b/);
  if (numeric) {
    return new Date(Number(numeric[2]), Number(numeric[1]) - 1, 1);
  }

  const named = value.match(/\b([A-Za-z]+)\.?\s+((?:19|20)\d{2})\b/);
  if (named) {
    const month = monthIndexes[named[1].toLowerCase()];
    return new Date(Number(named[2]), month ?? (isEnd ? 11 : 0), 1);
  }

  const year = value.match(/\b(19|20)\d{2}\b/)?.[0];
  return year ? new Date(Number(year), isEnd ? 11 : 0, 1) : null;
}

function getExperienceRange(experience: ResumeExperience) {
  const source = [
    experience.title,
    experience.startDate,
    experience.endDate,
    ...experience.rawLines,
  ]
    .filter(Boolean)
    .join(" ");
  const match = source.match(dateRangePattern);
  const start = match ? parseDatePoint(match[1]) : parseDatePoint(experience.startDate ?? "");
  const end = match
    ? parseDatePoint(match[2], true)
    : parseDatePoint(experience.endDate?.trim() || "Present", true);

  if (!start || !end || end < start) {
    return { start: null, end: null, months: 0 };
  }

  const months = Math.max(
    1,
    (end.getFullYear() - start.getFullYear()) * 12 +
      end.getMonth() -
      start.getMonth() +
      1,
  );

  return { start, end, months };
}

function getIndustrySignals(experience: ResumeExperience, fallback?: string) {
  const text = [
    experience.title,
    experience.company,
    ...experience.rawLines,
    ...experience.bullets,
  ].join(" ");
  const industries = industrySignals
    .filter(([, pattern]) => pattern.test(text))
    .map(([industry]) => industry);

  return industries.length > 0 ? industries : fallback ? [fallback] : [];
}

function getConcurrentMonths(first: ExperienceSignal, second: ExperienceSignal) {
  if (!first.start || !first.end || !second.start || !second.end) {
    return 0;
  }

  const start = new Date(Math.max(first.start.getTime(), second.start.getTime()));
  const end = new Date(Math.min(first.end.getTime(), second.end.getTime()));

  if (end < start) {
    return 0;
  }

  return Math.max(
    1,
    (end.getFullYear() - start.getFullYear()) * 12 +
      end.getMonth() -
      start.getMonth() +
      1,
  );
}

function pairKey(first: string, second: string) {
  return [first, second].sort().join("::");
}

function getPreciseDateValues(source: string) {
  return Array.from(
    new Set(source.match(new RegExp(preciseDatePoint, "gi")) ?? []),
  );
}

function recoverJobDates(
  job: ResumeExperience,
  resumeLines: string[],
  resumeText = "",
) {
  const directSource = [job.title, ...job.rawLines].filter(Boolean).join(" ");
  let values = getPreciseDateValues(directSource);
  const knownEnd = job.endDate ? parseDatePoint(job.endDate, true) : null;
  const nearbySources: string[] = [];

  if (values.length < 2 && resumeLines.length > 0) {
    const company = normalizeJobIdentity(job.company);
    const title = normalizeJobIdentity(job.title);
    const anchorIndexes = resumeLines.flatMap((line, index) => {
      const normalizedLine = normalizeJobIdentity(line);
      const matches =
        (company.length > 3 &&
          (normalizedLine.includes(company) || company.includes(normalizedLine))) ||
        (title.length > 5 &&
          (normalizedLine.includes(title) || title.includes(normalizedLine)));

      return matches ? [index] : [];
    });

    for (const anchorIndex of anchorIndexes) {
      nearbySources.push(resumeLines
        .slice(Math.max(0, anchorIndex - 4), anchorIndex + 12)
        .join(" "));
    }
  }

  if (resumeText) {
    const lowerText = resumeText.toLowerCase();
    const anchors = [job.company, job.title]
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value.length > 5 && value !== "role");

    for (const anchor of anchors) {
      let anchorIndex = lowerText.indexOf(anchor);

      while (anchorIndex >= 0) {
        nearbySources.push(
          resumeText.slice(
            Math.max(0, anchorIndex - 350),
            Math.min(resumeText.length, anchorIndex + anchor.length + 700),
          ),
        );
        anchorIndex = lowerText.indexOf(anchor, anchorIndex + anchor.length);
      }
    }
  }

  for (const nearbySource of nearbySources) {
    const nearbyRange = nearbySource.match(dateRangePattern);

    if (nearbyRange) {
      const rangeEnd = parseDatePoint(nearbyRange[2], true);
      const matchesKnownEnd =
        !knownEnd ||
        (rangeEnd !== null &&
          rangeEnd.getFullYear() === knownEnd.getFullYear() &&
          rangeEnd.getMonth() === knownEnd.getMonth());

      if (matchesKnownEnd) {
        return {
          startDate: job.startDate || nearbyRange[1],
          endDate: job.endDate || nearbyRange[2],
        };
      }
    }

    values = Array.from(
      new Set([...values, ...getPreciseDateValues(nearbySource)]),
    );
  }

  const datedValues = values
    .map((value) => ({ value, date: parseDatePoint(value) }))
    .filter(
      (item): item is { value: string; date: Date } => item.date !== null,
    )
    .toSorted((first, second) => first.date.getTime() - second.date.getTime());
  const startCandidate = knownEnd
    ? datedValues.find(({ date }) => date < knownEnd)
    : datedValues[0];

  return {
    startDate: job.startDate || startCandidate?.value,
    endDate:
      job.endDate ||
      (datedValues.length > 1
        ? datedValues[datedValues.length - 1]?.value
        : undefined),
  };
}

function createResumeIndustryHistory(
  experience: ResumeExperience[],
  fallbackIndustry?: string,
  resumeLines: string[] = [],
  resumeText = "",
): UserIndustryJobHistory[] {
  return experience.flatMap((job) => {
    const headline = [job.title, job.company].filter(Boolean).join(" ");
    const headlineIndustry = industrySignals.find(([, pattern]) =>
      pattern.test(headline),
    )?.[0];
    const industry = headlineIndustry ?? getIndustrySignals(job, fallbackIndustry)[0];
    const source = [
      job.title,
      job.startDate,
      job.endDate,
      ...job.rawLines,
    ]
      .filter(Boolean)
      .join(" ");
    const recoveredRange = source.match(dateRangePattern);
    const recoveredDates = recoverJobDates(job, resumeLines, resumeText);
    const startDate = job.startDate || recoveredRange?.[1] || recoveredDates.startDate;
    const endDate = job.endDate || recoveredRange?.[2] || recoveredDates.endDate;

    return industry ? [{
      id: `${job.id || "job"}-industry`,
      industry,
      title: job.title,
      company: job.company,
      startDate,
      endDate,
    }] : [];
  });
}

function dedupeIndustryHistory(
  jobs: UserIndustryJobHistory[],
): UserIndustryJobHistory[] {
  const uniqueJobs = new Map<string, UserIndustryJobHistory>();

  for (const job of jobs) {
    const key = [
      job.title,
      job.company,
      job.startDate,
      job.endDate,
    ]
      .map((value) => value?.trim().toLowerCase() ?? "")
      .join("::");
    const current = uniqueJobs.get(key);
    const matchingPattern = industrySignals.find(
      ([industry]) => industry.toLowerCase() === job.industry.trim().toLowerCase(),
    )?.[1];
    const currentPattern = current
      ? industrySignals.find(
          ([industry]) => industry.toLowerCase() === current.industry.trim().toLowerCase(),
        )?.[1]
      : undefined;
    const headline = `${job.title} ${job.company}`;
    const jobIsHeadlineMatch = matchingPattern?.test(headline) ?? false;
    const currentIsHeadlineMatch = currentPattern?.test(headline) ?? false;

    if (!current || (!currentIsHeadlineMatch && jobIsHeadlineMatch)) {
      uniqueJobs.set(key, job);
    }
  }

  return Array.from(uniqueJobs.values());
}

function normalizeJobIdentity(value: string) {
  return value
    .replace(dateRangePattern, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeStoredDate(value?: string) {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (/^(present|current)$/i.test(trimmed)) {
    return /^current$/i.test(trimmed) ? "Present" : trimmed;
  }

  const preciseValue = trimmed.match(new RegExp(preciseDatePoint, "i"))?.[0];
  if (preciseValue) {
    return preciseValue;
  }

  return /^(?:19|20)\d{2}$/.test(trimmed) ? trimmed : undefined;
}

function restoreResumeDates(
  jobs: UserIndustryJobHistory[],
  resumeJobs: UserIndustryJobHistory[],
  resumeLines: string[],
  resumeText: string,
) {
  return jobs.map((job) => {
    const recoveredFromSource = recoverJobDates(
      toResumeExperience(job),
      resumeLines,
      resumeText,
    );

    const company = normalizeJobIdentity(job.company);
    const title = normalizeJobIdentity(job.title);
    const companyMatches = resumeJobs.filter(
      (resumeJob) => normalizeJobIdentity(resumeJob.company) === company,
    );
    const matchingResumeJob =
      companyMatches.find((resumeJob) => {
        const resumeTitle = normalizeJobIdentity(resumeJob.title);
        return resumeTitle === title || resumeTitle.includes(title) || title.includes(resumeTitle);
      }) ?? (companyMatches.length === 1 ? companyMatches[0] : undefined);
    const normalizedStartDate = normalizeStoredDate(job.startDate);
    const normalizedEndDate = normalizeStoredDate(job.endDate);

    return matchingResumeJob
      ? {
          ...job,
          title:
            normalizeJobIdentity(job.title) === "role" &&
            normalizeJobIdentity(matchingResumeJob.title) !== "role"
              ? matchingResumeJob.title
              : job.title,
          startDate:
            normalizedStartDate ||
            matchingResumeJob.startDate ||
            recoveredFromSource.startDate,
          endDate:
            normalizedEndDate ||
            matchingResumeJob.endDate ||
            recoveredFromSource.endDate,
        }
      : {
          ...job,
          startDate: normalizedStartDate || recoveredFromSource.startDate,
          endDate: normalizedEndDate || recoveredFromSource.endDate,
        };
  });
}

function toResumeExperience(job: UserIndustryJobHistory): ResumeExperience {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    startDate: job.startDate,
    endDate: job.endDate,
    bullets: [],
    rawLines: [],
  };
}

export function getIndustryExperienceData(
  user: UserProfile,
  activeResumeId: string,
): IndustryExperienceData {
  const { parsedDocument, structuredResume } = getResumeIntelligence(
    user,
    activeResumeId,
  );
  const hasCurrentResumeOverride =
    user.industryHistory !== undefined &&
    (!structuredResume || user.industryHistoryResumeId === activeResumeId);
  const resumeJobs = createResumeIndustryHistory(
    structuredResume?.experience ?? [],
    user.currentIndustry,
    parsedDocument?.lines ?? [],
    parsedDocument?.rawText ?? "",
  );
  const jobs = dedupeIndustryHistory(
    hasCurrentResumeOverride
      ? restoreResumeDates(
          user.industryHistory ?? [],
          resumeJobs,
          parsedDocument?.lines ?? [],
          parsedDocument?.rawText ?? "",
        )
      : resumeJobs,
  );

  const signals: ExperienceSignal[] = jobs
    .map((job) => ({
      industries: job.industry.trim() ? [job.industry.trim()] : [],
      ...getExperienceRange(toResumeExperience(job)),
    }))
    .filter((signal) => signal.industries.length > 0);
  const industryTotals = new Map<string, { months: number; roleCount: number }>();
  const overlapTotals = new Map<string, number>();

  for (const signal of signals) {
    for (const industry of signal.industries) {
      const current = industryTotals.get(industry) ?? { months: 0, roleCount: 0 };
      industryTotals.set(industry, {
        months: current.months + signal.months,
        roleCount: current.roleCount + 1,
      });
    }

    for (let firstIndex = 0; firstIndex < signal.industries.length; firstIndex += 1) {
      for (
        let secondIndex = firstIndex + 1;
        secondIndex < signal.industries.length;
        secondIndex += 1
      ) {
        const key = pairKey(
          signal.industries[firstIndex],
          signal.industries[secondIndex],
        );
        overlapTotals.set(key, (overlapTotals.get(key) ?? 0) + signal.months);
      }
    }
  }

  for (let firstIndex = 0; firstIndex < signals.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < signals.length;
      secondIndex += 1
    ) {
      const concurrentMonths = getConcurrentMonths(
        signals[firstIndex],
        signals[secondIndex],
      );

      if (concurrentMonths === 0) {
        continue;
      }

      for (const firstIndustry of signals[firstIndex].industries) {
        for (const secondIndustry of signals[secondIndex].industries) {
          if (firstIndustry === secondIndustry) {
            continue;
          }

          const key = pairKey(firstIndustry, secondIndustry);
          overlapTotals.set(key, (overlapTotals.get(key) ?? 0) + concurrentMonths);
        }
      }
    }
  }

  const industries = Array.from(industryTotals, ([industry, value]) => ({
    industry,
    ...value,
  }))
    .sort((first, second) => second.months - first.months);
  const selectedIndustries = new Set(industries.map(({ industry }) => industry));
  const overlaps = Array.from(overlapTotals, ([key, months]) => {
    const [first, second] = key.split("::");
    const firstMonths = industryTotals.get(first)?.months ?? 0;
    const secondMonths = industryTotals.get(second)?.months ?? 0;

    return {
      first,
      second,
      months: Math.min(months, firstMonths, secondMonths),
    };
  }).filter(
    ({ first, second, months }) =>
      months > 0 && selectedIndustries.has(first) && selectedIndustries.has(second),
  );

  return {
    industries,
    overlaps,
    hasDatedEvidence: signals.some(({ months }) => months > 0),
    jobs,
  };
}
