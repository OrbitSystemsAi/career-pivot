export type ResumeDocumentContent = {
  resumeId: string;
  summary: string;
  highlights: {
    title: string;
    description: string;
  }[];
};

export const resumeDocumentData: ResumeDocumentContent[] = [
  {
    resumeId: "resume-executive-ai",
    summary:
      "Senior transformation and finance leader with experience across business intelligence, executive reporting, automation, financial systems, and operational strategy. Positioned for healthcare leadership roles focused on AI-enabled enterprise transformation.",
    highlights: [
      {
        title: "Enterprise Transformation Leadership",
        description:
          "Led cross-functional initiatives connecting finance, operations, data, and technology teams to improve decision-making and reporting quality.",
      },
      {
        title: "Business Intelligence & Analytics",
        description:
          "Built reporting and analytical models that improved visibility into performance, revenue, operations, and executive KPIs.",
      },
      {
        title: "AI & Automation Positioning",
        description:
          "Developed automation-oriented workflows and data processes that support scalable digital transformation.",
      },
    ],
  },
  {
    resumeId: "resume-finance-leadership",
    summary:
      "Finance and technology leader with deep experience in financial planning, business intelligence, operational reporting, data integrity, and executive-level decision support.",
    highlights: [
      {
        title: "Financial Leadership",
        description:
          "Supported executive financial planning and performance management across complex operational environments.",
      },
      {
        title: "Data-Driven Decision Support",
        description:
          "Built reporting models and analytical processes that improved visibility into revenue, operations, and financial performance.",
      },
      {
        title: "Systems & Process Improvement",
        description:
          "Improved data workflows across finance, technology, and business operations teams.",
      },
    ],
  },
];