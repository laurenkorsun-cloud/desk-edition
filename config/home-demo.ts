export const DEMO_LENSES = [
  { slug: "audit", name: "Audit" },
  { slug: "tax", name: "Tax" },
  { slug: "wealth_management", name: "Wealth mgmt" },
  { slug: "consulting", name: "Consulting" },
  { slug: "investment_banking", name: "Investment banking" },
  { slug: "technology", name: "Technology" },
  { slug: "medical", name: "Medical" },
  { slug: "environmental_science", name: "Environmental" },
  { slug: "politics", name: "Politics" },
  { slug: "legal", name: "Legal" },
] as const;

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
];

export const DEMO_GOALS = [
  { id: "informed", label: "Stay informed" },
  { id: "small_talk", label: "Office small talk" },
  { id: "learn", label: "Learn something new" },
  { id: "calm", label: "Start the day calm" },
];

export const DEMO_MODULES = [
  { slug: "news", name: "News", desc: "Headlines for your industry" },
  { slug: "markets", name: "Markets", desc: "What moved & why" },
  { slug: "talking_points", name: "Talking points", desc: "Conversation starters" },
  { slug: "weather", name: "Weather", desc: "Local forecast" },
  { slug: "calendar", name: "Calendar", desc: "Your day at a glance" },
  { slug: "music", name: "Music", desc: "Morning playlist" },
  { slug: "books", name: "Books", desc: "Quick synopsis" },
  { slug: "movies", name: "Movies", desc: "What to watch" },
  {
    slug: "clothing_sales",
    name: "Clothing sales",
    desc: "Professional wear deals & sales",
  },
];

export const DEMO_TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
];

export type DemoPreferences = {
  primaryLens: string;
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
  hobbies: ["Music", "Reading"],
  customHobby: "",
  goals: ["informed", "small_talk"],
  timezone: "America/New_York",
  wakeTime: "09:30",
  city: "New York",
  contentTone: 50,
  modules: {
    news: true,
    markets: true,
    talking_points: true,
    weather: true,
    calendar: true,
    music: true,
    books: false,
    movies: false,
    clothing_sales: false,
  },
};

export const DEMO_STORAGE_KEY = "deskEditionDemo";
