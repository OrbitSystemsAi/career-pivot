import type { StructuredResume } from "./resumeStructureTypes";

export type ParsedResumeDocument = {
  fileName: string;
  rawText: string;
  lines: string[];
  structuredResume?: StructuredResume;
  parsedDate: string;
};