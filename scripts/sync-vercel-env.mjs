#!/usr/bin/env node
/**
 * Push .env.local → Vercel (production + preview + development).
 *
 * Prereqs: npx vercel login && npx vercel link (in project root)
 * Run: npm run env:sync-vercel
 */

import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_FILE = join(ROOT, ".env.local");

const SYNC_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_APP_URL",
  "OPENAI_API_KEY",
  "OPENAI_MODEL",
  "OPENAI_MAX_TOKENS_PERSONAL",
  "ADMIN_SECRET",
  "CRON_SECRET",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "TAVILY_API_KEY",
  "SERPER_API_KEY",
  "WEB_SEARCH_PROVIDER",
  "WEB_SEARCH_MAX_QUERIES",
  "USE_SAMPLE_EDITION",
  "ALERT_EMAIL",
];

const PLACEHOLDER_RE = /^(PASTE_|YOUR_|placeholder|xxxxx|change-me)/i;

function parseEnvFile(path) {
  const vars = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    vars[key] = val;
  }
  return vars;
}

function runVercel(args, { input } = {}) {
  return spawnSync("npx", ["--yes", "vercel@latest", ...args], {
    cwd: ROOT,
    input,
    encoding: "utf8",
    stdio: ["pipe", "inherit", "inherit"],
  });
}

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  if (!existsSync(ENV_FILE)) {
    console.error("Missing .env.local — run: bash scripts/setup-env.sh");
    process.exit(1);
  }

  const vars = parseEnvFile(ENV_FILE);

  const url = vars.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const service = vars.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (PLACEHOLDER_RE.test(url) || !url.includes("supabase.co")) {
    console.error(
      "NEXT_PUBLIC_SUPABASE_URL in .env.local is missing or still a placeholder."
    );
    console.error("Paste real keys from Supabase → Project Settings → API.");
    process.exit(1);
  }
  if (PLACEHOLDER_RE.test(service) || service.length < 40) {
    console.error(
      "SUPABASE_SERVICE_ROLE_KEY in .env.local is missing or invalid."
    );
    process.exit(1);
  }

  const whoami = spawnSync("npx", ["--yes", "vercel@latest", "whoami"], {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (whoami.status !== 0) {
    console.error("Not logged in to Vercel. Run: npx vercel login");
    process.exit(1);
  }

  if (!existsSync(join(ROOT, ".vercel", "project.json"))) {
    console.log("Linking this folder to your Vercel project…");
    const link = runVercel(["link", "--yes"]);
    if (link.status !== 0) process.exit(link.status ?? 1);
  }

  let appUrl = vars.NEXT_PUBLIC_APP_URL ?? "";
  if (!appUrl || /127\.0\.0\.1|localhost/.test(appUrl)) {
    console.log(
      "\n.env.local still has a local NEXT_PUBLIC_APP_URL — production needs your Vercel URL."
    );
    const detected = await ask(
      "Paste your Vercel URL (e.g. https://desk-edition-xxx.vercel.app): "
    );
    if (!detected.startsWith("https://")) {
      console.error("URL must start with https://");
      process.exit(1);
    }
    appUrl = detected.replace(/\/$/, "");
    vars.NEXT_PUBLIC_APP_URL = appUrl;
  }

  const environments = ["production", "preview", "development"];
  console.log("\nSyncing env vars to Vercel…\n");

  for (const key of SYNC_KEYS) {
    const value = vars[key];
    if (!value || PLACEHOLDER_RE.test(value)) continue;

    for (const env of environments) {
      runVercel(["env", "rm", key, env, "--yes"], {});
      const add = runVercel(["env", "add", key, env, "--yes", "--force"], {
        input: value,
      });
      if (add.status !== 0) {
        console.error(`Failed to set ${key} (${env})`);
        process.exit(add.status ?? 1);
      }
    }
    console.log(`  ✓ ${key}`);
  }

  console.log("\nDone. Redeploy so the app picks up env vars:");
  console.log("  npx vercel --prod\n");
  console.log("Then verify: curl https://YOUR-APP/api/health");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
