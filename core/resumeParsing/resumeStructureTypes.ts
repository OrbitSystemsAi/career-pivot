export type ResumeExperience = {
  id: string;
  company: string;
  title: string;
  startDate?: string;
  endDate?: string;
  bullets: string[];
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
};