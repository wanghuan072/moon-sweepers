export type Status = "verified" | "community" | "unverified";
export interface Section { heading: string; paragraphs: string[]; steps?: string[] }
export interface FactTable { title: string; columns: string[]; rows: string[][]; note?: string; source?: string; rowLinks?: string[] }
export interface ProductionFlow { title: string; nodes: { label: string; href: string; detail: string }[] }
export interface Stat { label: string; value: string; source?: string }
export interface Entry {
  isDetails?: boolean;
  slug: string; title: string; description: string; category: string;
  tdk: {title: string; description: string; keywords: string[]; lengthNote?: string};
  publishedAt?: string; announcedAt?: string;
  relatedLinks?: {title: string; href: string}[];
  status: Status; updatedAt: string; version?: string; image?: string;
  sections: Section[]; sources: string[]; related?: string[];
  stats?: Stat[]; tables?: FactTable[]; dataNote?: string;
  faqs?: {question:string;answer:string}[];
  flows?: ProductionFlow[];
  imageRole?: "icon" | "equipment" | "scene";
  imageKind?: 'concept' | 'diagram' | 'official' | 'reference'; imageAlt?: string;
  imageCaption?: string; imageSource?: string; imageCredit?: string;
}
export interface WikiCategory { slug: string; title: string; description: string; icon: string; heroTitle?: string; relatedLinks?: Entry['relatedLinks'] }
