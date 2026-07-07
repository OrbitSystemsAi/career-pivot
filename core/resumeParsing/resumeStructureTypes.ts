export type ResumeExperience = {
  id: string;
  company: string;
  title: string;
  startDate?: string;
  endDate?: string;
  bullets: string[];
  rawLines: string[];
};

export type ResumeUnknownSection = {
  id: string;
  title: string;
  lines: string[];
};

export type StructuredResume = {
  name?: string;

  contact: {
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
  };

  summary?: string;

  skills: string[];

  experience: ResumeExperience[];

  education: string[];

  certifications: string[];

  unknownSections: ResumeUnknownSection[];

  unclassifiedLines: string[];
};