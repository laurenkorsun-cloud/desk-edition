"use client";

import { useState } from "react";
import type { LensRow, ModuleRow } from "@/lib/config-types";

export function AdminConfigEditor({
  secret,
  lenses,
  modules,
}: {
  secret: string;
  lenses: LensRow[];
  modules: ModuleRow[];
}) {
  const [message, setMessage] = useState("");

  async function seedConfig() {
    const res = await fetch(`/api/admin/seed-config?secret=${secret}`, {
      method: "POST",
      headers: { "x-admin-secret": secret },
    });
    const data = await res.json();
    setMessage(res.ok ? `Seeded ${data.lenses} lenses, ${data.modules} modules` : data.error);
    if (res.ok) window.location.reload();
  }

  async function saveLens(slug: string, prompt_addon: string) {
    const res = await fetch(`/api/admin/lenses?secret=${secret}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": secret,
      },
      body: JSON.stringify({ slug, prompt_addon }),
    });
    setMessage(res.ok ? `Saved lens ${slug}` : (await res.json()).error);
  }

  async function saveModule(slug: string, admin_body: string) {
    const res = await fetch(`/api/admin/modules?secret=${secret}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": secret,
      },
      body: JSON.stringify({ slug, admin_body }),
    });
    setMessage(res.ok ? `Saved module ${slug}` : (await res.json()).error);
  }

  return (
    <div className="space-y-10">
      <div>
        <button
          type="button"
          onClick={seedConfig}
          className="bg-[var(--accent)] px-4 py-2 font-sans text-sm text-white"
        >
          Seed / reset lenses & modules
        </button>
        {message && (
          <p className="mt-2 font-sans text-sm text-[var(--muted)]">{message}</p>
        )}
      </div>

      <section>
        <h2 className="font-display text-2xl">Lenses (you edit)</h2>
        <p className="font-sans text-sm text-[var(--muted)]">
          Users pick these; you control prompts and RSS feeds.
        </p>
        <div className="mt-4 space-y-6">
          {lenses.map((l) => (
            <LensEditor key={l.slug} lens={l} onSave={saveLens} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Modules (you edit)</h2>
        <p className="font-sans text-sm text-[var(--muted)]">
          Users toggle on/off; you edit curated content for manual modules.
        </p>
        <div className="mt-4 space-y-6">
          {modules.map((m) => (
            <ModuleEditor key={m.slug} module={m} onSave={saveModule} />
          ))}
        </div>
      </section>
    </div>
  );
}

function LensEditor({
  lens,
  onSave,
}: {
  lens: LensRow;
  onSave: (slug: string, prompt: string) => void;
}) {
  const [prompt, setPrompt] = useState(lens.prompt_addon);
  return (
    <div className="border border-[var(--border)] p-4">
      <h3 className="font-sans font-medium">{lens.name}</h3>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        className="mt-2 w-full border border-[var(--border)] px-3 py-2 font-sans text-sm"
      />
      <button
        type="button"
        onClick={() => onSave(lens.slug, prompt)}
        className="mt-2 font-sans text-sm underline"
      >
        Save lens
      </button>
    </div>
  );
}

function ModuleEditor({
  module,
  onSave,
}: {
  module: ModuleRow;
  onSave: (slug: string, body: string) => void;
}) {
  const [body, setBody] = useState(module.admin_body);
  return (
    <div className="border border-[var(--border)] p-4">
      <h3 className="font-sans font-medium">{module.name}</h3>
      <p className="font-sans text-xs text-[var(--muted)]">{module.description}</p>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        className="mt-2 w-full border border-[var(--border)] px-3 py-2 font-sans text-sm"
        placeholder="Founder-edited content shown when this module is on..."
      />
      <button
        type="button"
        onClick={() => onSave(module.slug, body)}
        className="mt-2 font-sans text-sm underline"
      >
        Save module
      </button>
    </div>
  );
}
