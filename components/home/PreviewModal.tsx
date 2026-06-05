"use client";

import { useEffect } from "react";
import type { DemoPreferences } from "@/config/home-demo";
import type { PreviewSample } from "@/lib/preview-sample";
import { LivePreview } from "@/components/home/LivePreview";

export function PreviewModal({
  open,
  onClose,
  prefs,
  sample,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  prefs: DemoPreferences;
  sample: PreviewSample | null;
  loading: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button
        type="button"
        aria-label="Close preview"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-[var(--border)] bg-[var(--paper)] shadow-xl sm:max-w-lg">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 font-sans text-sm text-[var(--muted)] underline hover:text-[var(--ink)]"
        >
          Close
        </button>
        <LivePreview prefs={prefs} sample={sample} loading={loading} />
      </div>
    </div>
  );
}
