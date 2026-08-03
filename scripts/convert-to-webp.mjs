#!/usr/bin/env node
/**
 * Convert every PNG under src/ to a sibling .webp (originals kept as
 * fallback). Uses cwebp (libwebp) at high quality (-q 95),
 * which is near-lossless for photographic content and typically
 * 30–50% smaller than PNG.
 *
 *   node scripts/convert-to-webp.mjs            # convert (skip existing)
 *   node scripts/convert-to-webp.mjs --force  # overwrite existing .webp
 *   node scripts/convert-to-webp.mjs --lossless   # use -lossless (exact, ~15-25% smaller)
 */
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_ROOT = path.join(ROOT, "src");

const force = process.argv.includes("--force");
const lossless = process.argv.includes("--lossless");
const qualityArgs = lossless ? ["-lossless"] : ["-q", "95"];

async function walk(dir, files = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") continue;
      await walk(full, files);
    } else if (entry.isFile() && /\.png$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

async function main() {
  const files = await walk(SRC_ROOT);
  console.log(`Found ${files.length} PNGs under src/. Converting with cwebp ${lossless ? "(lossless)" : "(quality 95)"}...\n`);

  let converted = 0;
  let skipped = 0;
  let failed = 0;
  let pngTotal = 0;
  let webpTotal = 0;

  for (const png of files.sort()) {
    const webp = png.replace(/\.png$/i, ".webp");
    if (existsSync(webp) && !force) {
      skipped++;
      continue;
    }
    const before = (await fs.stat(png)).size;
    // cwebp -q 95 in.png -o out.webp
    const r = spawnSync("cwebp", [...qualityArgs, png, "-o", webp], { encoding: "utf8" });
    if (r.status !== 0 || !existsSync(webp)) {
      failed++;
      console.log(`! ${path.relative(ROOT, png)} — cwebp failed (exit ${r.status})`);
      continue;
    }
    const after = (await fs.stat(webp)).size;
    pngTotal += before;
    webpTotal += after;
    converted++;
    const saved = (((before - after) / before) * 100).toFixed(1);
    console.log(`${formatBytes(before).padStart(9)} -> ${formatBytes(after).padStart(9)} (-${saved}%)  ${path.relative(ROOT, png)}`);
  }

  console.log(`\n--- summary ---`);
  console.log(`PNGs found:     ${files.length}`);
  console.log(`Converted:      ${converted}`);
  console.log(`Skipped:       ${skipped} (already had .webp)`);
  console.log(`Failed:        ${failed}`);
  if (pngTotal > 0) {
    const savedPct = (((pngTotal - webpTotal) / pngTotal) * 100).toFixed(1);
    console.log(`PNG total:     ${formatBytes(pngTotal)}`);
    console.log(`WebP total:     ${formatBytes(webpTotal)}`);
    console.log(`Saved:          ${formatBytes(pngTotal - webpTotal)} (-${savedPct}%)`);
  }
  console.log(`\nOriginals kept as fallback. Re-run with --force to overwrite existing .webp.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
