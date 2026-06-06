"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StockQuote, StockSearchResult } from "@/lib/stocks";
import { DEFAULT_WATCHLIST } from "@/lib/stocks";
import { StockBarRow } from "./StockBarRow";
import { StockDetailChart } from "./StockDetailChart";

type Props = {
  token: string;
  initialSymbols?: string[];
};

export function StockWatchlistPanel({
  token,
  initialSymbols = DEFAULT_WATCHLIST,
}: Props) {
  const [symbols, setSymbols] = useState<string[]>(
    initialSymbols.length > 0 ? initialSymbols : DEFAULT_WATCHLIST
  );
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialLoad = useRef(true);

  const loadQuotes = useCallback(async (syms: string[]) => {
    if (syms.length === 0) {
      setQuotes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/stocks/quote?symbols=${encodeURIComponent(syms.join(","))}`
      );
      const data = await res.json();
      const fetched: StockQuote[] = data.quotes ?? [];
      setQuotes(fetched);
      setSelected((prev) => prev ?? fetched[0]?.symbol ?? null);
    } catch {
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuotes(symbols);
  }, [symbols, loadQuotes]);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/stocks/search?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setSearchResults(data.results ?? []);
      } catch {
        setSearchResults([]);
      }
    }, 280);
    return () => {
      if (searchRef.current) clearTimeout(searchRef.current);
    };
  }, [query]);

  const addSymbol = (sym: string) => {
    const upper = sym.toUpperCase();
    if (symbols.includes(upper)) {
      setSelected(upper);
      setQuery("");
      setSearchResults([]);
      return;
    }
    const next = [...symbols, upper].slice(0, 12);
    setSymbols(next);
    setSelected(upper);
    setDirty(true);
    setQuery("");
    setSearchResults([]);
  };

  const removeSymbol = (sym: string) => {
    const next = symbols.filter((s) => s !== sym);
    setSymbols(next);
    if (selected === sym) setSelected(next[0] ?? null);
    setDirty(true);
  };

  const saveWatchlist = useCallback(async () => {
    setSaving(true);
    try {
      await fetch("/api/me/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, symbols }),
      });
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }, [token, symbols]);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    if (!dirty) return;
    if (saveRef.current) clearTimeout(saveRef.current);
    saveRef.current = setTimeout(() => {
      void saveWatchlist();
    }, 800);
    return () => {
      if (saveRef.current) clearTimeout(saveRef.current);
    };
  }, [dirty, saveWatchlist]);

  const selectedQuote =
    quotes.find((q) => q.symbol === selected) ??
    quotes[0] ??
    null;

  return (
    <section className="mb-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-muted)]">
            Your watchlist
          </h2>
          <p className="mt-2 font-sans text-sm text-[var(--briefing-muted)]">
            Search any ticker or ETF, explore trends, and save picks to your
            dashboard.
          </p>
        </div>
        {dirty && (
          <button
            type="button"
            onClick={saveWatchlist}
            disabled={saving}
            className="rounded-sm bg-[var(--briefing-green)] px-4 py-2 font-sans text-sm font-medium text-white hover:bg-[var(--briefing-green-hover)] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save to dashboard"}
          </button>
        )}
      </div>

      <div className="relative mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stocks & ETFs (e.g. AAPL, SPY, NVDA)"
          className="w-full rounded-sm border border-[var(--briefing-ink)]/[0.12] bg-white/80 px-4 py-3 font-sans text-sm text-[var(--briefing-ink)] placeholder:text-[var(--briefing-muted)] focus:border-[var(--briefing-green)] focus:outline-none"
        />
        {searchResults.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-sm border border-[var(--briefing-ink)]/[0.1] bg-white shadow-lg">
            {searchResults.map((r) => (
              <li key={r.symbol}>
                <button
                  type="button"
                  onClick={() => addSymbol(r.symbol)}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left font-sans text-sm hover:bg-[var(--briefing-green)]/[0.06]"
                >
                  <span className="font-semibold text-[var(--briefing-ink)]">
                    {r.symbol}
                  </span>
                  <span className="ml-3 truncate text-[var(--briefing-muted)]">
                    {r.name}
                  </span>
                  <span className="ml-2 shrink-0 text-[10px] uppercase text-[var(--briefing-muted)]">
                    {r.type}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedQuote && (
        <div className="mb-6">
          <StockDetailChart quote={selectedQuote} />
        </div>
      )}

      <div className="space-y-2">
        {loading && quotes.length === 0 && (
          <p className="font-sans text-sm text-[var(--briefing-muted)]">
            Loading quotes…
          </p>
        )}
        {quotes.map((q) => (
          <StockBarRow
            key={q.symbol}
            quote={q}
            selected={selected === q.symbol}
            saved={symbols.includes(q.symbol)}
            onSelect={() => setSelected(q.symbol)}
            onToggleSave={() =>
              symbols.includes(q.symbol)
                ? removeSymbol(q.symbol)
                : addSymbol(q.symbol)
            }
          />
        ))}
      </div>
    </section>
  );
}
