import { readFile, writeFile, rename, mkdir, access } from "node:fs/promises";
import { spawnSync } from "node:child_process";
// Move only the POST-only route out of Next's route tree, then restore in finally.
// GitHub Pages cannot run this API; the UI explicitly uses WhatsApp handoff.
const route = "app/api/consultation/route.ts";
const saved = ".data/pages-consultation-route.ts";
await mkdir(".data", { recursive: true });
try { await access(saved); throw new Error("An interrupted Pages build exists. Restore .data/pages-consultation-route.ts to app/api/consultation/route.ts first."); }
catch (e) { if (e.code !== "ENOENT") throw e; }
await rename(route, saved);
try {
  const env = {
    ...process.env,
    NEXT_PUBLIC_STATIC_PREVIEW: "true",
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || "/ehsan-portfolio",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://ehsanersan.github.io/ehsan-portfolio",
  };
  for (const args of [["scripts/build-thumbnails.mjs"], ["node_modules/next/dist/bin/next", "build"]]) {
    const result = spawnSync(process.execPath, args, { stdio: "inherit", env });
    if (result.error || result.status !== 0) throw result.error || new Error(`Build failed (${result.status})`);
  }
  await writeFile(".next-pages/.nojekyll", "");
} finally {
  await rename(saved, route);
}
