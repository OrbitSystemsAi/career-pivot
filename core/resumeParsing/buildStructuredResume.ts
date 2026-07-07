import type { StructuredResume } from "./resumeStructureTypes";

function findSectionIndex(lines: string[], sectionNames: string[]) {
  return lines.findIndex((line) => {
    const normalizedLine = line.trim().toLowerCase();

    return sectionNames.some((sectionName) =>
      normalizedLine.includes(sectionName)
    );
  });
}

function sliceSection(
  lines: string[],
  startIndex: number,
  possibleEndIndexes: number[]
) {
  if (startIndex < 0) {
    return [];
  }

  const validEndIndexes = possibleEndIndexes.filter(
    (index) => index > startIndex
  );

  const endIndex =
    validEndIndexes.length > 0 ? Math.min(...validEndIndexes) : lines.length;

  return lines.slice(startIndex + 1, endIndex).filter(Boolean);
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

export function buildStructuredResume(lines: string[]): StructuredResume {
  const fullText = lines.join(" ");

  const summaryIndex = findSectionIndex(lines, [
    "summary",
    "professional summary",
    "profile",
  ]);

  const skillsIndex = findSectionIndex(lines, [
    "skills",
    "core competencies",
    "technical skills",
    "competencies",
  ]);

  const experienceIndex = findSectionIndex(lines, [
    "experience",
    "professional experience",
    "work experience",
    "employment",
  ]);

  const educationIndex = findSectionIndex(lines, ["education"]);

  const certificationIndex = findSectionIndex(lines, [
    "certifications",
    "licenses",
    "credentials",
  ]);

  const sectionIndexes = [
    summaryIndex,
    skillsIndex,
    experienceIndex,
    educationIndex,
    certificationIndex,
  ].filter((index) => index >= 0);

  const summaryLines = sliceSection(lines, summaryIndex, sectionIndexes);
  const skillsLines = sliceSection(lines, skillsIndex, sectionIndexes);
  const experienceLines = sliceSection(lines, experienceIndex, sectionIndexes);
  const educationLines = sliceSection(lines, educationIndex, sectionIndexes);
  const certificationLines = sliceSection(
    lines,
    certificationIndex,
    sectionIndexes
  );

  const skills = skillsLines
    .flatMap((line) => line.split(/[,|•]/))
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    name: lines[0],

    contact: {
      email: extractEmail(fullText),
      phone: extractPhone(fullText),
      linkedin: extractLinkedIn(fullText),
    },

    summary: summaryLines.join(" "),

    skills,

    experience:
      experienceLines.length > 0
        ? [
            {
              id: "experience-1",
              company: "Detected Company",
              title: "Detected Role",
              bullets: experienceLines,
            },
          ]
        : [],

    education: educationLines,

    certifications: certificationLines,
  };
}