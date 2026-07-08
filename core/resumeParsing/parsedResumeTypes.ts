import type { DocumentResume } from "./documentResumeTypes";
import type { StructuredResume } from "./resumeStructureTypes";

export type ParsedResumeDocument = {
  fileName: string;
  rawText: string;
  htmlPreview?: string;
  lines: string[];
  documentResume?: DocumentResume;
  structuredResume?: StructuredResume;
  parsedDate: string;
};