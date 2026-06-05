export type LensRow = {
  slug: string;
  name: string;
  rss_feeds: { name: string; url: string }[];
  prompt_addon: string;
  is_active: boolean;
  sort_order: number;
  updated_at: string;
};

export type ModuleRow = {
  slug: string;
  name: string;
  description: string;
  requires_integration: string | null;
  default_on: boolean;
  is_active: boolean;
  sort_order: number;
  admin_body: string;
  updated_at: string;
};

export type LensSeed = Omit<LensRow, "updated_at" | "is_active"> & {
  is_active?: boolean;
};

export type ModuleSeed = Omit<
  ModuleRow,
  "updated_at" | "is_active" | "requires_integration"
> & {
  is_active?: boolean;
  requires_integration?: string | null;
};

export type ModuleItem = {
  headline: string;
  synopsis: string;
  description: string;
  sourceUrl?: string;
  sourceName?: string;
};

export type ModuleSource = {
  title: string;
  url: string;
};

export type ModuleBlock = {
  slug: string;
  title: string;
  synopsis?: string;
  description?: string;
  body: string;
  items?: ModuleItem[];
  sources?: ModuleSource[];
  data?: Record<string, unknown>;
};

export type PersonalEditionContent = {
  lede: string;
  sections: import("@/lib/types").Section[];
  talkingPoints: string[];
  talkingPointsByCategory?: Record<string, string[]>;
  emailBullets: string[];
  modules: ModuleBlock[];
  editionNumber?: number;
  meta: {
    primaryLens: string;
    secondaryLens: string | null;
    enabledModules: string[];
  };
};
