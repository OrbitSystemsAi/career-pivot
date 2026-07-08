import type { DocumentResume, DocumentResumeSection } from "./documentResumeTypes";

const SECTION_TITLES = [
  "professional summary",
  "summary",
  "profile",
  "core competencies",
  "competencies",
  "skills",
  "technical skills",
  "professional experience",
  "experience",
  "work experience",
  "career history",
  "education",
  "certifications",
  "credentials",
  "licenses",
  "projects",
  "awards",
  "publications",
  "languages",
];

function normalizeLine(line: string) {
  return line.trim().replace(/\s+/g, " ");
}

function isSectionTitle(line: string) {
  const normalized = normalizeLine(line).toLowerCase().replace(/[:\-]/g, "");

  if (normalized.length > 60) {
    return false;
  }

  return SECTION_TITLES.some(
    (title) => normalized === title || normalized.includes(title)
  );
}

export function buildDocumentResume(lines: string[]): DocumentResume {
  const cleanedLines = lines.map(normalizeLine).filter(Boolean);

  const firstSectionIndex = cleanedLines.findIndex((line) =>
    isSectionTitle(line)
  );

  const introLines =
    firstSectionIndex >= 0
      ? cleanedLines.slice(0, firstSectionIndex)
      : cleanedLines.slice(0, 4);

  const remainingLines =
    firstSectionIndex >= 0
      ? cleanedLines.slice(firstSectionIndex)
      : cleanedLines.slice(4);

  const headerLines = introLines.slice(0, 2);
  const headline = introLines.slice(2).join(" ");

  const sections: DocumentResumeSection[] = [];
  let currentSection: DocumentResumeSection | null = null;

  remainingLines.forEach((line) => {
    if (isSectionTitle(line)) {
      if (currentSection) {
        sections.push(currentSection);
      }

      currentSection = {
        id: `section-${sections.length + 1}`,
        title: line,
        lines: [],
      };

      return;
    }

    if (!currentSection) {
      currentSection = {
        id: `section-${sections.length + 1}`,
        title: "Additional Resume Content",
        lines: [],
      };
    }

    currentSection.lines.push(line);
  });

  if (currentSection) {
    sections.push(currentSection);
  }

  return {
    headerLines,
    headline,
    sections,
  };
}