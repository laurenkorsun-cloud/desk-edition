import { MODULE_TAGLINES, moduleLabel } from "@/config/module-labels";
import { SEED_MODULES } from "@/config/seed-lenses-modules";

export type ModuleGroup = "essential" | "lifestyle";

export type ModuleCatalogEntry = {
  group: ModuleGroup;
  readMin: number;
  locked?: boolean;
  hub?: boolean;
};

/** Single source for onboarding groups + hub visibility. Keys must match SEED_MODULES slugs. */
export const MODULE_CATALOG: Record<string, ModuleCatalogEntry> = {
  news: { group: "essential", readMin: 3, locked: true },
  markets: { group: "essential", readMin: 2 },
  talking_points: { group: "essential", readMin: 1 },
  industry_lens: { group: "essential", readMin: 1, locked: true },
  weather: { group: "lifestyle", readMin: 1, hub: true },
  calendar: { group: "lifestyle", readMin: 1, hub: true },
  music: { group: "lifestyle", readMin: 1, hub: true },
  books: { group: "lifestyle", readMin: 2, hub: true },
  movies: { group: "lifestyle", readMin: 1, hub: true },
  clothing_sales: { group: "lifestyle", readMin: 1, hub: true },
  vacation_planning: { group: "lifestyle", readMin: 1, hub: true },
  historical_fact: { group: "lifestyle", readMin: 1, hub: true },
  commute: { group: "lifestyle", readMin: 1, hub: true },
  sports_scores: { group: "lifestyle", readMin: 1, hub: true },
  podcast_pick: { group: "lifestyle", readMin: 1, hub: true },
};

export const NORDSTROM_CLOTHING_SALE_URL =
  "https://www.nordstrom.com/browse/sale/men/clothing";

export type DemoModule = {
  slug: string;
  name: string;
  desc: string;
  readMin: number;
  group: ModuleGroup;
  locked?: boolean;
};

export function buildDemoModules(): DemoModule[] {
  return SEED_MODULES.filter((m) => MODULE_CATALOG[m.slug]).map((m) => {
    const meta = MODULE_CATALOG[m.slug]!;
    return {
      slug: m.slug,
      name: moduleLabel(m.slug),
      desc: MODULE_TAGLINES[m.slug] ?? m.description,
      readMin: meta.readMin,
      group: meta.group,
      locked: meta.locked,
    };
  });
}

export const HUB_MODULE_SLUGS = Object.entries(MODULE_CATALOG)
  .filter(([, meta]) => meta.hub)
  .map(([slug]) => slug) as readonly string[];

export function isHubModuleSlug(slug: string): boolean {
  return HUB_MODULE_SLUGS.includes(slug);
}
