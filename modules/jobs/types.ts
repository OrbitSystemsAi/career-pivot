export type WorkMode = "on-site" | "remote" | "hybrid";

export type FinanceTitleId =
  | "financial-analyst"
  | "senior-financial-analyst"
  | "fpa"
  | "finance-manager"
  | "accounting-manager"
  | "controller"
  | "finance-director"
  | "treasury"
  | "risk-analyst"
  | "business-intelligence"
  | "accountant"
  | "wealth-management"
  | "grants-finance";

export type LiveJob = {
  id: string;
  company: string;
  title: string;
  salary: string;
  workType: WorkMode;
  location: string;
  hiringManager: string;
  url: string;
  source: "Jobicy" | "Remotive" | "The Muse";
  publishedAt: string;
};

export type LiveJobsResponse = {
  jobs: LiveJob[];
  calculatedAt: string;
  sources: string[];
  errors: string[];
};
