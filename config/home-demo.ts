import { buildDemoModules, type DemoModule } from "@/config/module-catalog";
import { DEFAULT_CORP_TOGGLES } from "@/config/seed-lenses-modules";

export type DemoLens = {
  slug: string;
  name: string;
  subtitle: string;
};

export const DEMO_LENSES: DemoLens[] = [
  { slug: "audit", name: "Audit", subtitle: "Big 4, PCAOB, busy season" },
  { slug: "tax", name: "Tax", subtitle: "Compliance, deadlines, policy" },
  {
    slug: "wealth_management",
    name: "Wealth mgmt",
    subtitle: "Markets, portfolios, HNW clients",
  },
  {
    slug: "consulting",
    name: "Consulting",
    subtitle: "Strategy, ops, C-suite priorities",
  },
  {
    slug: "investment_banking",
    name: "Investment banking",
    subtitle: "Deals, M&A, capital markets",
  },
  { slug: "technology", name: "Technology", subtitle: "AI, cloud, enterprise software" },
  { slug: "medical", name: "Medical", subtitle: "Clinical research, health policy" },
  {
    slug: "environmental_science",
    name: "Environmental",
    subtitle: "Climate, energy, ESG",
  },
  { slug: "politics", name: "Politics", subtitle: "Policy, legislation, geopolitics" },
  { slug: "legal", name: "Legal", subtitle: "Courts, regulation, deals" },
  {
    slug: "general_business",
    name: "General business",
    subtitle: "Broad corporate & office life",
  },
  { slug: "product", name: "Product", subtitle: "Roadmaps, launches, users" },
  { slug: "marketing", name: "Marketing", subtitle: "Brands, campaigns, growth" },
  {
    slug: "data_analytics",
    name: "Data & analytics",
    subtitle: "BI, metrics, experimentation",
  },
  { slug: "hr", name: "HR", subtitle: "People ops, culture, hiring" },
  {
    slug: "government",
    name: "Government",
    subtitle: "Public sector, agencies, policy",
  },
  { slug: "nonprofit", name: "Nonprofit", subtitle: "Mission, grants, stakeholders" },
  { slug: "student", name: "Student", subtitle: "Internships, campus to career" },
];

export const DEMO_HOBBY_CHIPS = [
  "Music",
  "Travel",
  "Sports",
  "Reading",
  "Fashion",
  "Cooking",
  "Fitness",
  "Film & TV",
  "Investing",
  "Art",
  "Podcasts",
  "Gaming",
  "Food & dining",
  "Outdoors",
  "Photography",
  "Startups",
];

export const DEMO_GOALS = [
  { id: "meetings", label: "Prepared for meetings" },
  { id: "markets", label: "Understand markets" },
  { id: "small_talk", label: "Office small talk" },
  { id: "calm", label: "Start the day calm" },
];

export type { DemoModule };

export const DEMO_MODULES: DemoModule[] = buildDemoModules();

export const DEMO_TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
];

export type DemoPreferences = {
  primaryLens: string;
  secondaryLens: string | null;
  hobbies: string[];
  customHobby: string;
  goals: string[];
  timezone: string;
  wakeTime: string;
  city: string;
  contentTone: number;
  modules: Record<string, boolean>;
};

export const DEFAULT_DEMO: DemoPreferences = {
  primaryLens: "audit",
  secondaryLens: null,
  hobbies: ["Music", "Reading"],
  customHobby: "",
  goals: ["meetings", "small_talk"],
  timezone: "America/New_York",
  wakeTime: "09:30",
  city: "New York",
  contentTone: 50,
  modules: { ...DEFAULT_CORP_TOGGLES },
};

export const DEMO_STORAGE_KEY = "deskEditionDemo";

export function countEnabledModules(modules: Record<string, boolean>): number {
  return Object.values(modules).filter(Boolean).length;
}

export function toneLabel(contentTone: number): "straight" | "balanced" | "witty" {
  if (contentTone < 33) return "straight";
  if (contentTone > 66) return "witty";
  return "balanced";
}

export const TALKING_POINT_TONE_SAMPLES: Record<
  "straight" | "balanced" | "witty",
  string
> = {
  straight:
    "Fed minutes dropped after the close—useful if rates come up in your standup.",
  balanced:
    "Fed minutes landed last night; handy if anyone at the office mentions rates today.",
  witty:
    "The Fed published minutes that read like a group chat where nobody wants to be first to suggest hiking.",
};
