import type { StructuredResume } from "@/core/resumeParsing/resumeStructureTypes";

export default function StructuredResumePreview({ resume }: { resume: StructuredResume }) {
  const contact = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.location,
    resume.contact.linkedin,
  ].filter(Boolean);

  return (
    <article className="mx-auto min-h-[66rem] w-full max-w-[816px] bg-white px-12 py-11 text-[#1d2935] shadow-sm print:shadow-none">
      <header className="border-b border-[#b9c8ce] pb-5">
        <h1 className="text-3xl font-semibold tracking-[-.035em] text-[#123743]">
          {resume.name || "Professional Resume"}
        </h1>
        {contact.length > 0 ? (
          <p className="mt-2 text-xs leading-5 text-[#526b7f]">{contact.join("  •  ")}</p>
        ) : null}
      </header>

      {resume.summary ? (
        <section className="mt-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#248ba3]">Summary</h2>
          <p className="mt-2 text-sm leading-6 text-[#425867]">{resume.summary}</p>
        </section>
      ) : null}

      {resume.skills.length > 0 ? (
        <section className="mt-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#248ba3]">Skills</h2>
          <p className="mt-2 text-sm leading-6 text-[#425867]">{resume.skills.join("  •  ")}</p>
        </section>
      ) : null}

      <section className="mt-7">
        <h2 className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#248ba3]">Professional Experience</h2>
        <div className="mt-4 space-y-6">
          {resume.experience.map((role) => (
            <section key={role.id}>
              <div className="flex items-start justify-between gap-5">
                <div>
                  <h3 className="text-sm font-semibold text-[#123743]">{role.title}</h3>
                  <p className="mt-0.5 text-xs font-medium text-[#526b7f]">{role.company}</p>
                </div>
                <p className="shrink-0 text-xs text-[#6d8792]">
                  {[role.startDate, role.endDate].filter(Boolean).join(" – ")}
                </p>
              </div>
              {role.bullets.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-[#425867]">
                  {role.bullets.map((bullet, index) => (
                    <li key={`${role.id}-bullet-${index}`}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </section>

      {resume.education.length > 0 ? (
        <section className="mt-7">
          <h2 className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#248ba3]">Education</h2>
          <div className="mt-2 space-y-1 text-sm leading-6 text-[#425867]">
            {resume.education.map((item, index) => <p key={`education-${index}`}>{item}</p>)}
          </div>
        </section>
      ) : null}

      {resume.certifications.length > 0 ? (
        <section className="mt-7">
          <h2 className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#248ba3]">Certifications</h2>
          <div className="mt-2 space-y-1 text-sm leading-6 text-[#425867]">
            {resume.certifications.map((item, index) => <p key={`certification-${index}`}>{item}</p>)}
          </div>
        </section>
      ) : null}
    </article>
  );
}
