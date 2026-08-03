#!/usr/bin/env node
/**
 * One-time raster image compression for src/ and public/.
 * Uses browser-image-compression in headless Chromium (Playwright).
 * Not wired into vite build — run manually when you want to shrink assets.
 *
 *   npm run compress:images              # dry-run (report savings only)
 *   npm run compress:images -- --write   # overwrite files that get smaller
 *   npm run compress:images -- --write --backup   # keep *.bak next to originals
 *   npm run compress:images -- --min-kb 500   # only files larger than 500 KB
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const libPath = path.resolve(root, "node_modules/browser-image-compression/dist/browser-image-compression.js");
const SCAN_DIRS = ["src", "public"];
const RASTER_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const write = process.argv.includes("--write");
const backup = process.argv.includes("--backup");

function parseMinBytes() {
  const idx = process.argv.indexOf("--min-kb");
  if (idx !== -1) {
    const value = Number(process.argv[idx + 1]);
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error("--min-kb requires a positive number (kilobytes)");
    }
    return value * 1024;
  }
  return 8 * 1024;
}

function parseTargetKb() {
  const idx = process.argv.indexOf("--target-kb");
  if (idx !== -1) {
    const value = Number(process.argv[idx + 1]);
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error("--target-kb requires a positive number (kilobytes)");
    }
    return value;
  }
  return 750;
}

function parseQuality() {
  const idx = process.argv.indexOf("--quality");
  if (idx !== -1) {
    const value = Number(process.argv[idx + 1]);
    if (!Number.isFinite(value) || value <= 0 || value > 1) {
      throw new Error("--quality requires a number in (0, 1]");
    }
    return value;
  }
  return 0.82;
}

// Optional path-substring filters (can be repeated): --match hero --match chips
function parseMatches() {
  const matches = [];
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === "--match" && process.argv[i + 1]) {
      matches.push(process.argv[i + 1]);
    }
  }
  return matches;
}

const MIN_BYTES = parseMinBytes();
const TARGET_MAX_KB = parseTargetKb();
const MAX_SIZE_MB = TARGET_MAX_KB / 1024;
const INITIAL_QUALITY = parseQuality();
const MATCH_FILTERS = parseMatches();
const PAGE_RECYCLE_EVERY = 15;

const MIME_BY_EXT = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

async function walk(dir, files = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") continue;
      await walk(fullPath, files);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (RASTER_EXT.has(ext)) files.push(fullPath);
  }

  return files;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function createCompressorPage(browser) {
  const page = await browser.newPage();
  await page.goto("about:blank");
  await page.addScriptTag({ path: libPath });
  return page;
}

async function compressBuffer(page, input, fileName, mime) {
  const base64 = input.toString("base64");
  const outputBase64 = await page.evaluate(
    async ({ base64, name, type, maxSizeMB, initialQuality }) => {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      const file = new File([bytes], name, { type });
      const compressed = await window.imageCompression(file, {
        maxSizeMB,
        useWebWorker: false,
        initialQuality,
        fileType: type,
        preserveExif: type === "image/jpeg",
      });

      const out = new Uint8Array(await compressed.arrayBuffer());
      let binaryStr = "";
      const chunk = 0x8000;
      for (let i = 0; i < out.length; i += chunk) {
        binaryStr += String.fromCharCode(...out.subarray(i, i + chunk));
      }
      return btoa(binaryStr);
    },
    { base64, name: fileName, type: mime, maxSizeMB: MAX_SIZE_MB, initialQuality: INITIAL_QUALITY },
  );

  return Buffer.from(outputBase64, "base64");
}

async function main() {
  const files = [];
  for (const dir of SCAN_DIRS) {
    await walk(path.join(root, dir), files);
  }

  let scanned = 0;
  let skippedSmall = 0;
  let improved = 0;
  let unchanged = 0;
  let failed = 0;
  let beforeTotal = 0;
  let afterTotal = 0;

  console.log(
    write
      ? `Compressing images > ${formatBytes(MIN_BYTES)} (target ≤ ${TARGET_MAX_KB} KB, quality ${INITIAL_QUALITY}${MATCH_FILTERS.length ? `, matching: ${MATCH_FILTERS.join(", ")}` : ""}) — write mode…`
      : `Dry run — files > ${formatBytes(MIN_BYTES)}, target ≤ ${TARGET_MAX_KB} KB, quality ${INITIAL_QUALITY}${MATCH_FILTERS.length ? `, matching: ${MATCH_FILTERS.join(", ")}` : ""}. Pass --write to apply.\n`,
  );

  const browser = await chromium.launch({ headless: true });
  let page = await createCompressorPage(browser);
  let processedSincePage = 0;

  try {
    for (const filePath of files.sort()) {
      // If --match filters were provided, only process files whose path contains
      // at least one of the filter substrings (case-insensitive).
      if (MATCH_FILTERS.length > 0) {
        const rel = path.relative(root, filePath).toLowerCase();
        if (!MATCH_FILTERS.some((m) => rel.includes(m.toLowerCase()))) {
          continue;
        }
      }

      const stat = await fs.stat(filePath);
      if (stat.size < MIN_BYTES) {
        skippedSmall += 1;
        continue;
      }

      scanned += 1;
      const ext = path.extname(filePath).toLowerCase();
      const mime = MIME_BY_EXT[ext];
      const rel = path.relative(root, filePath);

      try {
        const input = await fs.readFile(filePath);
        const output = await compressBuffer(page, input, path.basename(filePath), mime);

        beforeTotal += input.length;
        const nextSize = output.length < input.length ? output.length : input.length;
        afterTotal += nextSize;

        if (output.length >= input.length) {
          unchanged += 1;
          continue;
        }

        improved += 1;
        const saved = input.length - output.length;
        const pct = ((saved / input.length) * 100).toFixed(1);
        console.log(`${rel}: ${formatBytes(input.length)} → ${formatBytes(output.length)} (−${pct}%)`);

        if (write) {
          if (backup) {
            await fs.writeFile(`${filePath}.bak`, input);
          }
          await fs.writeFile(filePath, output);
        }

        processedSincePage += 1;
        if (processedSincePage >= PAGE_RECYCLE_EVERY) {
          await page.close();
          page = await createCompressorPage(browser);
          processedSincePage = 0;
        }
      } catch (error) {
        failed += 1;
        console.warn(`! ${rel}: ${error.message}`);
      }
    }
  } finally {
    await browser.close();
  }

  const savedTotal = beforeTotal - afterTotal;
  const summary = [
    `Scanned: ${scanned} files (${skippedSmall} skipped as < ${formatBytes(MIN_BYTES)})`,
    `Would improve: ${improved}`,
    `Already optimal: ${unchanged}`,
    failed ? `Failed: ${failed}` : null,
    `Total: ${formatBytes(beforeTotal)} → ${formatBytes(afterTotal)} (−${formatBytes(Math.max(0, savedTotal))})`,
    write ? "Changes written." : "No files changed. Re-run with --write to apply.",
  ]
    .filter(Boolean)
    .join("\n");

  console.log(`\n${summary}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
