#!/usr/bin/env node
/**
 * Find byte-identical image files across src/ and group them by content hash.
 * Reports each group (size > 1) with file paths, byte size, and where each
 * basename is referenced in the codebase. Does NOT modify or delete anything.
 *
 *   node scripts/find-duplicate-images.mjs
 */
import fs from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SCAN_DIR = path.join(ROOT, "src");
const IMG_EXT = /\.(png|jpe?g|webp|svg|gif|avif)$/i;
const EXCLUDE_DIRS = new Set(["node_modules", "dist", ".git"]);

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

function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });
}

function findRefs(basename) {
  // Find lines where this exact basename appears quoted, in url(), or as a key.
  const patterns = [`"${basename}"`, `'${basename}'`, `\`${basename}\``];
  const refs = [];
  for (const pat of patterns) {
    const r = spawnSync(
      "rg",
      ["-n", "-F", "--no-ignore", "-g", "!node_modules", "-g", "!dist", "-g", "!.git", pat, ROOT],
      { encoding: "utf8" },
    );
    if (r.status === 0 && r.stdout.trim()) {
      for (const line of r.stdout.trim().split("\n")) {
        if (line.includes(".bak")) continue;
        refs.push(line);
      }
    }
  }
  // Also check for unquoted url(.../basename) usage.
  const escaped = basename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const r2 = spawnSync(
    "rg",
    ["-n", "--no-ignore", "-g", "!node_modules", "-g", "!dist", "-g", "!.git", `-e`, `url\\([^)]*${escaped}[^)]*\\)`, ROOT],
    { encoding: "utf8" },
  );
  if (r2.status === 0 && r2.stdout.trim()) {
    for (const line of r2.stdout.trim().split("\n")) {
      if (line.includes(".bak")) continue;
      refs.push(line);
    }
  }
  return [...new Set(refs)];
}

async function main() {
  const files = await walk(SCAN_DIR);
  const byHash = new Map();
  for (const f of files) {
    const hash = await hashFile(f);
    if (!byHash.has(hash)) byHash.set(hash, []);
    byHash.get(hash).push(f);
  }

  const dupGroups = [];
  for (const [, group] of byHash) {
    if (group.length > 1) dupGroups.push(group);
  }

  console.log(`Scanned ${files.length} image files under src/.`);
  console.log(`Duplicate groups (byte-identical content): ${dupGroups.length}\n`);

  let totalRedundant = 0;
  for (const [i, group] of dupGroups.entries()) {
    const size = (await fs.stat(group[0])).size;
    totalRedundant += size * (group.length - 1);
    console.log(`=== Group ${i + 1} — ${group.length} identical files, ${size} bytes each ===`);
    for (const f of group) {
      const rel = path.relative(ROOT, f);
      const base = path.basename(f);
      const refs = findRefs(base);
      console.log(`  ${rel}`);
      if (refs.length === 0) {
        console.log(`     references: (none found)`);
      } else {
        for (const r of refs.slice(0, 6)) console.log(`     ref: ${r}`);
        if (refs.length > 6) console.log(`     ... +${refs.length - 6} more`);
      }
    }
    console.log("");
  }

  console.log(`--- summary ---`);
  console.log(`Duplicate groups:        ${dupGroups.length}`);
  console.log(`Redundant file copies:     ${dupGroups.reduce((n, g) => n + g.length - 1, 0)}`);
  console.log(`Redundant bytes (wasted):  ${(totalRedundant / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`\nDry run only. No files were modified.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
