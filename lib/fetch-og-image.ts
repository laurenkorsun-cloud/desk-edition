const CACHE = new Map<string, string | null>();

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

function decodeHtmlUrl(url: string): string {
  return url
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .trim();
}

function parseOgImage(html: string): string | null {
  const patterns = [
    /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]?.startsWith("http")) {
      return decodeHtmlUrl(match[1]);
    }
  }
  return null;
}

export async function fetchOgImageUrl(pageUrl: string): Promise<string | null> {
  if (!pageUrl?.startsWith("http")) return null;
  if (CACHE.has(pageUrl)) return CACHE.get(pageUrl) ?? null;

  try {
    const res = await fetch(pageUrl, {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10000),
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      CACHE.set(pageUrl, null);
      return null;
    }
    const html = await res.text();
    const imageUrl = parseOgImage(html);
    CACHE.set(pageUrl, imageUrl);
    return imageUrl;
  } catch {
    CACHE.set(pageUrl, null);
    return null;
  }
}
