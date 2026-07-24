import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Open your LinkedIn data settings",
    description:
      "Sign in to LinkedIn, open Settings & Privacy, select Data privacy, then choose Get a copy of your data.",
  },
  {
    number: "02",
    title: "Request your connections",
    description:
      "Choose the option to download selected data, select Connections, and request the archive. LinkedIn may ask you to confirm your account.",
  },
  {
    number: "03",
    title: "Download the archive",
    description:
      "LinkedIn will notify you when the export is ready. Download the archive and locate the Connections.csv file inside it.",
  },
  {
    number: "04",
    title: "Bring it back to Career Pivot",
    description:
      "Return to Network with Connections.csv ready. Career Pivot will use the file to identify confirmed contacts and possible career-relevant relationships.",
  },
];

export default function LinkedInImportGuidePage() {
  return (
    <main className="min-h-screen bg-[#102f39] p-4 text-[#102f39] sm:p-7 lg:p-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <header className="bg-[linear-gradient(135deg,#102f39_0%,#1b414c_48%,#2b6874_100%)] px-6 py-8 text-white sm:px-10 lg:px-14 lg:py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#d3e1e4] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f28c28] focus-visible:ring-offset-4 focus-visible:ring-offset-[#173a46]"
          >
            <span aria-hidden="true">←</span>
            Return to Career Pivot
          </Link>

          <div className="mt-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ffb25c]">
              LinkedIn connection import
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Turn your existing connections into a possible network
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#d3e1e4] sm:text-lg">
              Download the connections you already own from LinkedIn, then
              prepare that file for Career Pivot. Your account remains under your
              control throughout the process.
            </p>
          </div>
        </header>

        <section className="px-6 py-9 sm:px-10 lg:px-14 lg:py-12">
          <div className="grid gap-5 md:grid-cols-2">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-3xl border border-[#c8dfe9] bg-[linear-gradient(145deg,#ffffff,#eef8fb)] p-6 sm:p-7"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#173a46] text-sm font-bold text-white">
                  {step.number}
                </div>
                <h2 className="mt-5 text-xl font-semibold text-[#102f39]">
                  {step.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>

          <aside className="mt-6 rounded-3xl bg-[#e8f2f3] p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
            <div>
              <h2 className="text-lg font-semibold text-[#102f39]">
                What Career Pivot will—and will not—receive
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                A LinkedIn connections export generally contains relationship
                records such as names, profile links, companies, positions,
                and connection dates when LinkedIn includes them. It does not
                give Career Pivot your password, messages, or permission to act on
                LinkedIn for you.
              </p>
            </div>
            <a
              href="https://www.linkedin.com/mypreferences/d/download-my-data"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex shrink-0 items-center justify-center rounded-xl bg-[#173a46] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2b6874] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168391] focus-visible:ring-offset-2 sm:mt-0"
            >
              Open LinkedIn settings
              <span aria-hidden="true" className="ml-2">
                ↗
              </span>
            </a>
          </aside>
        </section>
      </div>
    </main>
  );
}
