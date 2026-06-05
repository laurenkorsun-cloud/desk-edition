/** Central env resolution — supports common Vercel / dashboard naming mistakes. */

const PLACEHOLDER_RE =
  /^(PASTE_|YOUR_|placeholder|xxxxx|change-me|local-dev)/i;

function clean(value: string | undefined): string {
  return (value ?? "").trim();
}

function isPlaceholder(value: string): boolean {
  if (!value) return true;
  if (PLACEHOLDER_RE.test(value)) return true;
  if (value.includes("PASTE_YOUR")) return true;
  return false;
}

export function getSupabaseUrl(): string {
  return clean(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  );
}

export function getSupabaseAnonKey(): string {
  return clean(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.SUPABASE_ANON_KEY
  );
}

export function getSupabaseServiceRoleKey(): string {
  return clean(
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.SUPABASE_SERVICE_KEY
  );
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseServiceRoleKey();
  return (
    !isPlaceholder(url) &&
    !isPlaceholder(key) &&
    url.includes("supabase.co")
  );
}

export type ConfigStatus = {
  supabase: boolean;
  openai: boolean;
  missing: string[];
};

export function getConfigStatus(): ConfigStatus {
  const missing: string[] = [];
  if (!getSupabaseUrl() || isPlaceholder(getSupabaseUrl())) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }
  if (
    !getSupabaseServiceRoleKey() ||
    isPlaceholder(getSupabaseServiceRoleKey())
  ) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }
  const openai = Boolean(clean(process.env.OPENAI_API_KEY));
  if (!openai) missing.push("OPENAI_API_KEY (optional for subscribe)");
  return {
    supabase: isSupabaseConfigured(),
    openai,
    missing,
  };
}
