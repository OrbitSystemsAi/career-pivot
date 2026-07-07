import type {
  ResumeExperience,
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

function normalizeLine(line: string) {
  return line.trim().replace(/\s+/g, " ");
}

function isSectionHeader(line: string, patterns: string[]) {
  const normalized = normalizeLine(line).toLowerCase().replace(/[:\-]/g, "");

  return patterns.some((pattern) => {
    const normalizedPattern = pattern.toLowerCase();

    return (
      normalized === normalizedPattern ||
      normalized.includes(normalizedPattern)
    );
  });
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

function looksLikeDateRange(line: string) {
  return /\b(19|20)\d{2}\b/.test(line) || /\bpresent\b/i.test(line);
}

function looksLikeRoleLine(line: string) {
  return /\b(manager|director|analyst|leader|consultant|engineer|specialist|coordinator|associate|vp|vice president|chief|head|officer)\b/i.test(
    line
  );
}

function looksLikeCompanyLine(line: string) {
  return (
    !line.startsWith("•") &&
    !line.startsWith("-") &&
    !looksLikeDateRange(line) &&
    line.length > 2 &&
    line.length < 90
  );
}

function cleanBullet(line: string) {
  return normalizeLine(line).replace(/^[-•*]\s*/, "");
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
      currentExperience = {
        id: `experience-${experiences.length + 1}`,
        company: isPossibleCompany ? normalized : "Detected Company",
        title: isPossibleRole ? normalized : "Detected Role",
        bullets: [],
      };

      return;
    }

    if (
      !isBullet &&
      isPossibleCompany &&
      (looksLikeRoleLine(nextLine) || looksLikeDateRange(nextLine))
    ) {
      experiences.push(currentExperience);

      currentExperience = {
        id: `experience-${experiences.length + 1}`,
        company: normalized,
        title: looksLikeRoleLine(nextLine) ? nextLine : "Detected Role",
        bullets: [],
      };

      return;
    }

    if (
      currentExperience.title === "Detected Role" &&
      isPossibleRole &&
      !isBullet
    ) {
      currentExperience.title = normalized;
      return;
    }

    if (looksLikeDateRange(normalized) && !isBullet) {
      const [startDate, endDate] = normalized.split(/\s[-–]\s/);

      currentExperience.startDate = startDate;
      currentExperience.endDate = endDate;

      return;
    }

    currentExperience.bullets.push(cleanBullet(normalized));
  });

  if (currentExperience) {
    experiences.push(currentExperience);
  }

  return experiences.filter(
    (experience) =>
      experience.company !== "Detected Company" ||
      experience.title !== "Detected Role" ||
      experience.bullets.length > 0
  );
}

function buildSkills(skillsLines: string[]) {
  return skillsLines
    .flatMap((line) => line.split(/[,|•]/))
    .map((item) => normalizeLine(item))
    .filter(Boolean)
    .filter((item) => item.length <= 80);
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

  return {
    name: cleanedLines[0],

    contact: {
      email: extractEmail(fullText),
      phone: extractPhone(fullText),
      linkedin: extractLinkedIn(fullText),
    },

    summary: summaryLines.join(" "),

    skills: buildSkills(skillsLines),

    experience: buildExperience(experienceLines),

    education: educationLines,

    certifications: certificationLines,
  };
}