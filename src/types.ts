export const ListeningIdentity = {
  MUSICAL: 'Musical',
  ANALYTICAL: 'Analytical',
  BALANCED: 'Balanced',
  CONSUMER: 'Consumer',
  UNKNOWN: 'Not documented'
} as const;
export type ListeningIdentity = typeof ListeningIdentity[keyof typeof ListeningIdentity];

export const AudioGrade = {
  PA: 'PA Grade',
  HIFI: 'Hi-Fi Grade',
  AUDIOPHILE: 'Audiophile Grade',
  UNKNOWN: 'Not documented'
} as const;
export type AudioGrade = typeof AudioGrade[keyof typeof AudioGrade];

export const PerformanceClass = {
  B: 'Class B',
  A: 'Class A',
  S: 'Class S',
  LEGEND: 'Class Legend',
  UNKNOWN: 'Not documented'
} as const;
export type PerformanceClass = typeof PerformanceClass[keyof typeof PerformanceClass];

export type Category =
  | 'Speakers' | 'Amplifiers' | 'DACs'
  | 'CD Players' | 'Turntables' | 'Headphones' | 'Cables';

export interface Section {
  header: string;   // verbatim header
  body: string;     // verbatim body
}

export interface ArchivalProduct {
  id: number;
  brandId: number;
  brandName: string;
  category: Category;
  model_name_raw: string; // verbatim
  model_name: string;     // normalized (suffix removed)
  sub_category?: string;  // new advanced taxonomy field
  release_year: number | null;
  origin: string | null;
  primary_intent: ListeningIdentity | null;
  use_case_tags: string[] | null;
  sections: Section[];
  specs: Record<string, string>;
  images: { alt: string; src: string }[];
  source_text: string;     // full verbatim source text
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  country?: string | null;
}

export interface QuizQuestion {
  id: number;
  text: string;
  cluster: string;
  impact: 'M+' | 'A+' | 'C+' | 'S+' | 'F+';
}

// Your existing UI type, now optional fields so we never invent
export interface AudioUnit {
  id: string;
  name: string;
  brand: string;
  category: string;
  intent?: ListeningIdentity;
  grade?: AudioGrade;
  performance?: PerformanceClass;
  score?: number;
  specs?: Record<string, string>;
  description?: string;
  heritage?: boolean;
}
