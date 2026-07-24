import type {
  ResumeExperience,
  ResumeUnknownSection,
  StructuredResume,
} from "./resumeStructureTypes";

type SectionKey =
  | "summary"
  | "skills"
  | "experience"
  | "education"
  | "certifications";

const SECTION_PATTERNS: Record<SectionKey, string[]> = {
  summary: ["summary", "professional summary", "profile", "about"],
  skills: [
    "skills",
    "core skills",
    "core competencies",
    "technical skills",
    "competencies",
    "areas of expertise",
  ],
  experience: [
    "experience",
    "professional experience",
    "work experience",
    "employment",
    "career history",
  ],
  education: ["education", "academic background"],
  certifications: [
    "certifications",
    "licenses",
    "credentials",
    "professional certifications",
  ],
};

const KNOWN_SECTION_WORDS = [
  "summary",
  "profile",
  "skills",
  "competencies",
  "experience",
  "employment",
  "career history",
  "education",
  "certifications",
  "licenses",
  "credentials",
  "projects",
  "awards",
  "publications",
  "volunteer",
  "languages",
  "technology",
  "tools",
];

function normalizeLine(line: string) {
  return line.trim().replace(/\s+/g, " ");
}

function isSectionHeader(line: string, patterns: string[]) {
  const normalized = normalizeLine(line).toLowerCase().replace(/[:\-]/g, "");

  return patterns.some((pattern) => normalized === pattern.toLowerCase());
}

function looksLikeAnySectionHeader(line: string) {
  const normalized = normalizeLine(line).toLowerCase().replace(/[:\-]/g, "");

  if (normalized.length > 60) {
    return false;
  }

  return KNOWN_SECTION_WORDS.some(
    (word) => normalized === word || normalized.includes(word)
  );
}

function findSectionIndexes(lines: string[]) {
  const indexes: Partial<Record<SectionKey, number>> = {};

  (Object.keys(SECTION_PATTERNS) as SectionKey[]).forEach((sectionKey) => {
    const index = lines.findIndex((line) =>
      isSectionHeader(line, SECTION_PATTERNS[sectionKey])
    );

    if (index >= 0) {
      indexes[sectionKey] = index;
    }
  });

  return indexes;
}

function sliceSection(
  lines: string[],
  startIndex: number | undefined,
  allSectionIndexes: number[]
) {
  if (startIndex === undefined || startIndex < 0) {
    return [];
  }

  const nextSectionIndex = allSectionIndexes
    .filter((index) => index > startIndex)
    .sort((a, b) => a - b)[0];

  return lines
    .slice(startIndex + 1, nextSectionIndex ?? lines.length)
    .map(normalizeLine)
    .filter(Boolean);
}

function extractEmail(text: string) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
}

function extractPhone(text: string) {
  return text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0];
}

function extractLinkedIn(text: string) {
  return text.match(/linkedin\.com\/[A-Za-z0-9/_-]+/i)?.[0];
}

function extractLocation(lines: string[]) {
  const statePattern =
    /\b[A-Za-z .'-]+,\s*(?:AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC)\b/i;

  return lines.slice(1, 8).find((line) => statePattern.test(line))?.match(statePattern)?.[0];
}

function looksLikeDateRange(line: string) {
  return /\b(19|20)\d{2}\b/.test(line) || /\bpresent\b/i.test(line);
}

function looksLikeRoleLine(line: string) {
  return /\b(manager|director|analyst|leader|consultant|engineer|specialist|coordinator|associate|vp|vice president|chief|head|officer|architect|developer|administrator|controller|finance|operations|founder|principal|owner|president|partner|executive)\b/i.test(
    line
  );
}

function looksLikeCompanyLine(line: string) {
  return (
    !line.startsWith("•") &&
    !line.startsWith("-") &&
    !looksLikeDateRange(line) &&
    line.length > 2 &&
    line.length < 100
  );
}

function cleanBullet(line: string) {
  return normalizeLine(line).replace(/^[-•*]\s*/, "");
}

function cleanRoleTitle(line: string) {
  const month =
    "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";
  const datedPoint = `(?:(?:${month}\\.?\\s+)?(?:19|20)\\d{2}|(?:0?[1-9]|1[0-2])\\/(?:19|20)\\d{2})`;
  const dateRange = new RegExp(
    `\\s*(?:[|(]\\s*)?${datedPoint}\\s*(?:-|–|—|to)\\s*(?:Present|Current|${datedPoint})\\s*\\)?\\s*$`,
    "i",
  );

  return normalizeLine(line)
    .replace(dateRange, "")
    .replace(/\s*[|,(]\s*$/, "")
    .trim();
}

function extractDateRange(line: string) {
  const month =
    "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";
  const datedPoint = `(?:(?:${month}\\.?\\s+)?(?:19|20)\\d{2}|(?:0?[1-9]|1[0-2])\\/(?:19|20)\\d{2})`;
  const match = normalizeLine(line).match(
    new RegExp(
      `(${datedPoint})\\s*(?:-|–|—|to)\\s*(Present|Current|${datedPoint})`,
      "i",
    ),
  );

  return match ? { startDate: match[1], endDate: match[2] } : null;
}

function buildExperience(experienceLines: string[]): ResumeExperience[] {
  if (experienceLines.length === 0) {
    return [];
  }

  const experiences: ResumeExperience[] = [];
  let currentExperience: ResumeExperience | null = null;

  experienceLines.forEach((line, index) => {
    const normalized = normalizeLine(line);
    const isBullet = /^[-•*]/.test(normalized);
    const isPossibleRole = looksLikeRoleLine(normalized);
    const isPossibleCompany = looksLikeCompanyLine(normalized);
    const nextLine = experienceLines[index + 1] ?? "";

    if (!currentExperience) {
      const dateRange = extractDateRange(normalized);
      currentExperience = {
        id: `experience-${experiences.length + 1}`,
        company: isPossibleCompany ? normalized : "Experience",
        title: isPossibleRole ? cleanRoleTitle(normalized) : "Role",
        bullets: [],
        rawLines: [normalized],
        startDate: dateRange?.startDate,
        endDate: dateRange?.endDate,
      };

      return;
    }

    if (
      !isBullet &&
      isPossibleCompany &&
      !/^[-•*]/.test(nextLine.trim()) &&
      (looksLikeRoleLine(nextLine) || looksLikeDateRange(nextLine))
    ) {
      experiences.push(currentExperience);

      const dateRange = extractDateRange(nextLine);

      currentExperience = {
        id: `experience-${experiences.length + 1}`,
        company: normalized,
        title: looksLikeRoleLine(nextLine) ? cleanRoleTitle(nextLine) : "Role",
        bullets: [],
        rawLines: [normalized],
        startDate: dateRange?.startDate,
        endDate: dateRange?.endDate,
      };

      return;
    }

    currentExperience.rawLines.push(normalized);

    if (
      currentExperience.title === "Role" &&
      isPossibleRole &&
      !isBullet
    ) {
      currentExperience.title = cleanRoleTitle(normalized);
      const dateRange = extractDateRange(normalized);
      if (dateRange) {
        currentExperience.startDate = dateRange.startDate;
        currentExperience.endDate = dateRange.endDate;
      }
      return;
    }

    if (looksLikeDateRange(normalized) && !isBullet) {
      const dateRange = extractDateRange(normalized);

      if (dateRange) {
        currentExperience.startDate = dateRange.startDate;
        currentExperience.endDate = dateRange.endDate;
      }

      return;
    }

    currentExperience.bullets.push(cleanBullet(normalized));
  });

  if (currentExperience) {
    experiences.push(currentExperience);
  }

  return experiences;
}

function buildSkills(skillsLines: string[]) {
  return skillsLines
    .flatMap((line) => line.split(/[,|•]/))
    .map((item) => normalizeLine(item))
    .filter(Boolean)
    .filter((item) => item.length <= 100);
}

function buildUnknownSections(lines: string[], knownIndexes: number[]) {
  const unknownSections: ResumeUnknownSection[] = [];

  lines.forEach((line, index) => {
    if (!looksLikeAnySectionHeader(line)) {
      return;
    }

    if (knownIndexes.includes(index)) {
      return;
    }

    const nextKnownOrUnknownIndex =
      lines.findIndex(
        (candidateLine, candidateIndex) =>
          candidateIndex > index &&
          (knownIndexes.includes(candidateIndex) ||
            looksLikeAnySectionHeader(candidateLine))
      ) ?? -1;

    const endIndex =
      nextKnownOrUnknownIndex > index ? nextKnownOrUnknownIndex : lines.length;

    const sectionLines = lines
      .slice(index + 1, endIndex)
      .map(normalizeLine)
      .filter(Boolean);

    if (sectionLines.length === 0) {
      return;
    }

    unknownSections.push({
      id: `unknown-section-${unknownSections.length + 1}`,
      title: normalizeLine(line),
      lines: sectionLines,
    });
  });

  return unknownSections;
}

export function buildStructuredResume(lines: string[]): StructuredResume {
  const cleanedLines = lines.map(normalizeLine).filter(Boolean);
  const fullText = cleanedLines.join(" ");

  const sectionIndexes = findSectionIndexes(cleanedLines);
  const allSectionIndexes = Object.values(sectionIndexes).filter(
    (index): index is number => typeof index === "number"
  );

  const summaryLines = sliceSection(
    cleanedLines,
    sectionIndexes.summary,
    allSectionIndexes
  );

  const skillsLines = sliceSection(
    cleanedLines,
    sectionIndexes.skills,
    allSectionIndexes
  );

  const experienceLines = sliceSection(
    cleanedLines,
    sectionIndexes.experience,
    allSectionIndexes
  );

  const educationLines = sliceSection(
    cleanedLines,
    sectionIndexes.education,
    allSectionIndexes
  );

  const certificationLines = sliceSection(
    cleanedLines,
    sectionIndexes.certifications,
    allSectionIndexes
  );

  const knownLineSet = new Set<string>();

  [
    ...summaryLines,
    ...skillsLines,
    ...experienceLines,
    ...educationLines,
    ...certificationLines,
  ].forEach((line) => knownLineSet.add(line));

  allSectionIndexes.forEach((index) => knownLineSet.add(cleanedLines[index]));

  const unknownSections = buildUnknownSections(cleanedLines, allSectionIndexes);

  unknownSections.forEach((section) => {
    knownLineSet.add(section.title);
    section.lines.forEach((line) => knownLineSet.add(line));
  });

  const unclassifiedLines = cleanedLines.filter((line, index) => {
    if (index === 0) {
      return false;
    }

    if (knownLineSet.has(line)) {
      return false;
    }

    if (line === extractEmail(fullText) || line === extractPhone(fullText)) {
      return false;
    }

    return true;
  });

  return {
    name: cleanedLines[0],

    contact: {
      email: extractEmail(fullText),
      phone: extractPhone(fullText),
      location: extractLocation(cleanedLines),
      linkedin: extractLinkedIn(fullText),
    },

    summary: summaryLines.join(" "),

    skills: buildSkills(skillsLines),

    experience: buildExperience(experienceLines),

    education: educationLines,

    certifications: certificationLines,

    unknownSections,

    unclassifiedLines,
  };
}
