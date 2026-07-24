import type { StructuredResume } from "./resumeStructureTypes";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function serializeStructuredResume(resume: StructuredResume) {
  const lines: string[] = [];

  if (resume.name) lines.push(resume.name);

  const contact = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.location,
    resume.contact.linkedin,
  ].filter((value): value is string => Boolean(value));
  if (contact.length > 0) lines.push(contact.join(" | "));

  if (resume.summary) lines.push("", "SUMMARY", resume.summary);
  if (resume.skills.length > 0) {
    lines.push("", "SKILLS", resume.skills.join(" · "));
  }

  lines.push("", "PROFESSIONAL EXPERIENCE");
  for (const role of resume.experience) {
    lines.push(role.title, role.company);
    const dateRange = [role.startDate, role.endDate].filter(Boolean).join(" - ");
    if (dateRange) lines.push(dateRange);
    lines.push(...role.bullets.map((bullet) => `• ${bullet}`), "");
  }

  if (resume.education.length > 0) {
    lines.push("EDUCATION", ...resume.education, "");
  }
  if (resume.certifications.length > 0) {
    lines.push("CERTIFICATIONS", ...resume.certifications, "");
  }

  const normalizedLines = lines.filter(
    (line, index) => line !== "" || lines[index - 1] !== "",
  );
  const rawText = normalizedLines.join("\n").trim();
  const htmlPreview = `<div>${normalizedLines
    .map((line) =>
      line ? `<p>${escapeHtml(line)}</p>` : "<br />",
    )
    .join("")}</div>`;

  return { htmlPreview, lines: normalizedLines, rawText };
}
