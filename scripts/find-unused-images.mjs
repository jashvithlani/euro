#!/usr/bin/env node
/**
 * Find image files under src/ and public/ that are NOT referenced anywhere in
 * the codebase (by basename). Prints the unused list and a total.
 *
 *   node scripts/find-unused-images.mjs            # report only
 *   node scripts/find-unused-images.mjs --delete   # delete the unused files
 *
 * References are detected by scanning all text files (js/jsx/ts/css/html/mjs/json)
 * for quoted strings ending in an image extension. public/investor-pdfs is
 * excluded (those are PDFs indexed by a generated manifest, handled separately).
 */
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DO_DELETE = process.argv.includes("--delete");

const IMG_EXT = /\.(png|jpe?g|webp|svg|gif|avif)$/i;
const SCAN_IMG_DIRS = ["src", "public"];
const EXCLUDE_DIRS = new Set(["node_modules", "dist", ".git", "investor-pdfs"]);
const TEXT_EXT = /\.(js|jsx|ts|tsx|css|scss|html|htm|mjs|json|md|php)$/i;

// Basenames matched by these regexes are treated as REFERENCED even if no literal
// string is found, because they are built dynamically at runtime (e.g. via
// template literals in asset() calls). Conservative: never delete these.
const DYNAMIC_PATTERNS = [
  /^category-khakhra-[\w-]+-vector-[ab]\.png$/i, // khakhra-content.jsx khakhraDecor()
];

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
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      await walk(full, files);
    } else if (entry.isFile() && IMG_EXT.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function collectReferenced() {
  // Scan every text file under root (excluding heavy/irrelevant dirs) for
  // quoted strings that look like image filenames.
  const referenced = new Set();
  const textFiles = [];

  async function walkText(dir) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (EXCLUDE_DIRS.has(entry.name) || entry.name === "assets" && false) continue;
        // still descend into assets (we want to find css references), but skip node_modules/dist/.git
        await walkText(full);
      } else if (entry.isFile() && TEXT_EXT.test(entry.name)) {
        textFiles.push(full);
      }
    }
  }

  await walkText(ROOT);
  // Also include index.html at root.
  const rootIndex = path.join(ROOT, "index.html");
  if (existsSync(rootIndex)) textFiles.push(rootIndex);

  // Capture quoted image paths — allow spaces/parens inside the filename (e.g.
  // "ORANGE TANGO-mobile.png"). Only exclude the quote chars themselves.
  const refRe = /["'`]([^"'`]+\.(?:png|jpe?g|webp|svg|gif|avif))["'`]/gi;

  for (const tf of textFiles) {
    let content;
    try {
      content = await fs.readFile(tf, "utf8");
    } catch {
      continue;
    }
    let m;
    while ((m = refRe.exec(content)) !== null) {
      // m[1] may be a path like "./assets/foo.png" or just "foo.png".
      const basename = path.basename(m[1]);
      referenced.add(basename);
    }
    // Also catch url(...) references in CSS: url(./assets/foo.png) or url(foo.png)
    const urlRe = /url\(\s*['"]?([^'")\s]+\.(?:png|jpe?g|webp|svg|gif|avif))['"]?\s*\)/gi;
    while ((m = urlRe.exec(content)) !== null) {
      referenced.add(path.basename(m[1]));
    }
  }
  return referenced;
}

async function main() {
  const onDisk = [];
  for (const d of SCAN_IMG_DIRS) {
    await walk(path.join(ROOT, d), onDisk);
  }
  const referenced = await collectReferenced();

  const unused = [];
  const used = [];
  for (const f of onDisk) {
    const basename = path.basename(f);
    if (referenced.has(basename) || DYNAMIC_PATTERNS.some((re) => re.test(basename))) {
      used.push(f);
    } else {
      unused.push(f);
    }
  }

  unused.sort();
  let unusedBytes = 0;
  for (const f of unused) {
    const stat = await fs.stat(f);
    unusedBytes += stat.size;
    const rel = path.relative(ROOT, f);
    console.log(`${(stat.size / 1024).toFixed(0).padStart(6)} KB  ${rel}`);
  }

  console.log(`\n--- summary ---`);
  console.log(`Images on disk:   ${onDisk.length}`);
  console.log(`Referenced:        ${used.length}`);
  console.log(`Unused:            ${unused.length}`);
  console.log(`Unused size:       ${(unusedBytes / (1024 * 1024)).toFixed(2)} MB`);

  if (DO_DELETE && unused.length > 0) {
    for (const f of unused) await fs.rm(f, { force: true });
    console.log(`\nDeleted ${unused.length} unused image files.`);
  } else if (unused.length > 0) {
    console.log(`\nDry run. Re-run with --delete to remove them.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
