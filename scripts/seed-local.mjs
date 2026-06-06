#!/usr/bin/env node
/** Seed lenses/modules on local dev — reads ADMIN_SECRET from .env.local */

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_FILE = join(ROOT, ".env.local");
const BASE = process.env.APP_URL ?? "http://127.0.0.1:4000";

function loadEnv(path) {
  const out = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    out[t.slice(0, i)] = t.slice(i + 1);
  }
  return out;
}

const env = loadEnv(ENV_FILE);
const secret = env.ADMIN_SECRET;
if (!secret) {
  console.error("Missing ADMIN_SECRET in .env.local");
  process.exit(1);
}

const url = `${BASE.replace(/\/$/, "")}/api/admin/seed-config`;
console.log(`POST ${url}`);

const res = await fetch(url, {
  method: "POST",
  headers: { "x-admin-secret": secret },
});
const text = await res.text();
console.log(res.status, text);

if (!res.ok) process.exit(1);
