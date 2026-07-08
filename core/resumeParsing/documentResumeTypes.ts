export type DocumentResumeSection = {
  id: string;
  title: string;
  lines: string[];
};

export type DocumentResume = {
  headerLines: string[];
  headline?: string;
  sections: DocumentResumeSection[];
};