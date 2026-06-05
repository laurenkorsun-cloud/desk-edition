"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="font-sans text-xs text-[var(--muted)] underline hover:text-[var(--ink)]"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
