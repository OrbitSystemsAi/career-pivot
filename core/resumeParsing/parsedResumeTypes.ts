import type { DocumentResume } from "./documentResumeTypes";
import type { StructuredResume } from "./resumeStructureTypes";

export type ResumeOptimizationSummary = {
  type: "ats" | "keywords" | "target_role" | "full_rewrite";
  label: string;
  notes: string[];
  createdFromVersionId?: string;
  createdDate: string;
};

export type ParsedResumeDocument = {
  fileName: string;
  rawText: string;
  htmlPreview?: string;
  lines: string[];

  originalFileName?: string;
  originalFileType?: string;
  originalFileDataUrl?: string;

  previewFileName?: string;
  previewFileType?: string;
  previewFileDataUrl?: string;

  optimizationSummary?: ResumeOptimizationSummary;

  documentResume?: DocumentResume;
  structuredResume?: StructuredResume;
  parsedDate: string;
};
