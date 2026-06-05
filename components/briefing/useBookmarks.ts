"use client";

import { useCallback, useEffect, useState } from "react";

export type BookmarkItem = {
  id: string;
  type: "story" | "talking_point";
  title: string;
  excerpt: string;
  category: string;
  url?: string;
  savedAt: string;
};

function storageKey(token: string) {
  return `desk-edition-bookmarks-${token}`;
}

export function useBookmarks(token: string) {
  const [items, setItems] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(token));
      setItems(raw ? (JSON.parse(raw) as BookmarkItem[]) : []);
    } catch {
      setItems([]);
    }
  }, [token]);

  const persist = useCallback(
    (next: BookmarkItem[]) => {
      setItems(next);
      localStorage.setItem(storageKey(token), JSON.stringify(next));
    },
    [token]
  );

  const add = useCallback(
    (item: Omit<BookmarkItem, "savedAt">) => {
      const entry: BookmarkItem = { ...item, savedAt: new Date().toISOString() };
      persist([entry, ...items.filter((i) => i.id !== item.id)]);
    },
    [items, persist]
  );

  const remove = useCallback(
    (id: string) => {
      persist(items.filter((i) => i.id !== id));
    },
    [items, persist]
  );

  const has = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  return { items, add, remove, has };
}
